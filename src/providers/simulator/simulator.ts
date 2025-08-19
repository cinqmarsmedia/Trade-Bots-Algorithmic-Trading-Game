import { Injectable } from '@angular/core';
import { BaklavaProvider } from '../baklava/baklava';
import { ChartsConfig, DataOhlc } from '../charts/charts';
import { EngineData } from '../nodes/types';
import { StateMachine } from '../state-machine/state-machine';

type SimulationEvent = "beforeStart" | "start" | "break" | "stop" | "end" | "majorBreak";


@Injectable()
export class Simulator {

  private _targetSpeed: number = 1;
  public get targetSpeed() {
    return this._targetSpeed;
  }
  public set targetSpeed(val: number) {
    this._targetSpeed = val;
    if (this._targetSpeed > this.hiSpeedThreshold) {
      this.minBreaksPerSecond = this.hiSpeedMinBreaksPerSecond;
      this.maxBreaksPerSecond = this.hiSpeedMaxBreaksPerSecond;
    } else {
      this.minBreaksPerSecond = this.regularSpeedMinBreaksPerSecond;
      this.maxBreaksPerSecond = this.regularSpeedMaxBreaksPerSecond;
    }
  }

  private _realtimeSpeed = 0;
  public simWarmupTimeSeconds = 2;
  public simWarmedUp = true;
  public get realtimeSpeed() {
    return this._realtimeSpeed;
  }

  private engineData: EngineData;
  private config: ChartsConfig;

  private callbacks: { [name: string]: Set<Function> } = {
    "beforeStart": new Set(),
    "start": new Set(),
    "break": new Set(),
    "majorBreak": new Set(),
    "stop": new Set(),
    "end": new Set(),
  };

  private _running: boolean;
  private get running() {
    return this._running;
  };
  private set running(val: boolean) {
    this._running = val;
    this.stateMachine.simulating = val;
  }



  public onStep: Function;
  public refreshEngineData: Function;
  public incrementDate: Function;
  public decrementDate: Function;
  private brushThreshold: number[]
  private el: string;

  constructor(private baklava: BaklavaProvider, private stateMachine: StateMachine) {

  }


  public init(el: string, engineData: EngineData, config: ChartsConfig, refreshEngineData: Function, incrementDate: Function, decrementDate: Function, brushThresold: Array<number>) {
    this.el = el;
    this.refreshEngineData = refreshEngineData;
    this.incrementDate = incrementDate;
    this.decrementDate = decrementDate;
    this.engineData = engineData;
    this.config = config;
    this.brushThreshold = brushThresold;
  }

  private startTimestamp: number;
  public async start(config: ChartsConfig, useBot: boolean = false) {
    if (config) {
      this.config = config;
    }
    this.startTimestamp = performance.now();
    this.refreshEngineData();

    setTimeout(() => this.newStart(useBot));
  }

  public async stop() {
    if (!this.running) {
      return;
    }
    await this._stop();
  }
  private async _stop() {
    this.running = false; 
    let brushDays = this.config.overrideBrushNumDays || 0;
    this.config.overrideBrushNumDays = null;
    const chartsProvider = this.engineData.chartsProvider;
    const closeData = this.config[this.config.brush].data.close;
    await this.break(true, true);
    if (brushDays > 0 && closeData.length >= brushDays) {
      chartsProvider.setBrush(closeData[Math.max(closeData.length - brushDays, 0)].date);
    }
    await this.majorBreak(false, true);
    this.sendEvent('stop');
  }
/*
  private hideChart() {
    document.getElementById("d3el").style.opacity = "0"
  }
  private showChart() {
    document.getElementById("d3el").style.opacity = "1"
  }
*/

private hideChart() {
  document.getElementById("d3el").style.display = "none"
}
private showChart() {
  document.getElementById("d3el").style.display = "block"
}


  //HOT
  private async step(useBot: boolean = false) {
    this.refreshEngineData();
    if (useBot) {
      await this.baklava.engineCalculate(this.engineData);
    }
    this.incrementDate();
    if (typeof (this.onStep) === "function") {
      this.onStep();
    }
  }

// In simulator.ts, modify the majorBreak method
private async majorBreak(render: boolean = null, force: boolean = false) {
  if (!this._running && !force) {
    return;
  }
  
  // Store the current brush state before rendering
  const wasBrushed = this.engineData.chartsProvider.brushed;
  let brushInfo = null;
  
  if (wasBrushed) {
    // Get current brush info to maintain the interval
    const brushSize = this.engineData.chartsProvider.getBrushSize();
    brushInfo = {
      tradingDays: brushSize.tradingDays,
      actualDays: brushSize.actualDays
    };
  }
  
  if ((this.targetSpeed >= this.hiSpeedThreshold && render !== false) || render === true) {
    // Render the chart with new data
    this.engineData.chartsProvider.render(this.el, this.config);
    
    // If brush was active, restore it to maintain the same interval
    if (wasBrushed && brushInfo) {
      // Move brush to end while maintaining the same size
      this.engineData.chartsProvider.moveBrushToEnd();
    }
  }
  
  this.stateMachine.writePendingLogs();
  await this.stateMachine.persistState();
  await this.sendEvent("majorBreak");
}

  private async break(render: boolean = null, force: boolean = false) {
    if (!this._running && !force) {
      return;
    }
    await this.sendEvent("break");
    if ((this.targetSpeed < this.hiSpeedThreshold && render !== false) || render === true) {
      await this.engineData.chartsProvider.render(this.el, this.config);
//      console.log("RENDER done", performance.now() - this.lastSecondTime);
    } 
  }

  public async stepOnce(useBot: boolean = false) {
    const chartsProvider = this.engineData.chartsProvider;
    let brushed = false;

    let brushBeforeSimStarted: {
      startDate: Date;
      endDate: Date;
    };

    if (chartsProvider.brushed) {
      brushed = true;
      chartsProvider.moveBrushToEnd();
      brushBeforeSimStarted = chartsProvider.getCurrentBrush();
      this.config.overrideBrushNumDays = Math.min(Math.ceil(chartsProvider.getBrushSize().tradingDays), Math.round(this.brushThreshold[1]));
    }

    await this.stepNDays(1, useBot);

    if (brushed) {
      chartsProvider.setBrush(brushBeforeSimStarted.startDate, brushBeforeSimStarted.endDate);
   chartsProvider.moveBrushToEnd()
    }
  }

  public async stepNDays(n: number = 1, useBot: boolean = false) {
    if (!this.config) {
      console.warn("trying to step through N days in simulator when simulator is not initialised")
      return;
    }
    if (this.refreshEngineData) {
      this.refreshEngineData();
    }
    for (let i = 0; i < n; i++) {
      if (this.engineData.dateKeyIndex == (this.engineData.currentData.length - 1)) {
        await this._stop();
        await this.sendEvent("end");
        return;
      }
      await this.step(useBot);
    }
    await this._stop();
  }

  public on(event: SimulationEvent, cb: Function) {
    this.callbacks[event].add(cb);
  }

  public off(event: SimulationEvent, cb: Function) {
    this.callbacks[event].delete(cb);
  }

  public clearEvents() {
    for (let x in this.callbacks) {
      this.callbacks[x].clear();
    }
    this.onStep = null;
  }

  public once(event: SimulationEvent, cb: Function) {
    const onceCb = () => {
      cb();
      this.off(event, onceCb);
    }
    this.callbacks[event].add(onceCb);
  }


  private sendEventSync(event: SimulationEvent) {
    let eventCallbacks = this.callbacks[event];
    for (let i = 0; i < eventCallbacks.size; i++) {
      eventCallbacks[i]();
    }
  }

  private async sendEvent(event: SimulationEvent) {
    let eventCallbacks = this.callbacks[event];
    for (var it = eventCallbacks.values(), val = null; val = it.next().value;) {
      await val();
    }
  }

  private currentCycleSize: number;
  private currentCycleIndex: number;




  private hiSpeedThreshold = 75; //days per second
  //the below values should be positive integers, or 0.5, 0.25, 0.125, etc.
  private minBreaksPerSecond = 2;
  private maxBreaksPerSecond = 8;
  //minimum FPS when simulating
  private regularSpeedMinBreaksPerSecond = 2; //at regular speeds, below hiSpeedThreshold
  private hiSpeedMinBreaksPerSecond = 1; //at high speeds, above hiSpeedThreshold
  //maximum FPS when simulating
  private regularSpeedMaxBreaksPerSecond = 8; //at regular speeds, below hiSpeedThreshold
  private hiSpeedMaxBreaksPerSecond = 2; //at high speeds, above hiSpeedThreshold


  private breakTime: number = 1000 / this.minBreaksPerSecond;
  private breaksPerMajorBreak = 4;

  private idleTime = 0;
  private lastBreakTimestamp = 0;

  private lastStepDuration: number;
  private lastBreakDuration: number;
  private stepsThisSecond = 0;

  private breakIndex = 0;

  private firstStepSinceStart: boolean = true;
  private useBot: boolean = false;
  private lastSecondTime: number;

  private performanceMargin = 1.15;



  public async newStart(useBot: boolean = false, targetSpeed: number = this.targetSpeed) {
    if (this._running) {
      return;
    }
    this.simWarmedUp = false;
    this.firstStepSinceStart = true;
    this.stepsThisSecond = 0;
    this.currentCycleSize = null;
    this.currentCycleIndex = 0;
    this.idleTime = 0;
    this._realtimeSpeed = 0;

    this.breakIndex = 0;
    this.useBot = useBot;

    if (targetSpeed) {
      this.targetSpeed = targetSpeed;
    }

    await this.sendEvent('beforeStart');

    this.running = true;
    const chartsProvider = this.engineData.chartsProvider;
    if (chartsProvider.brushed) {
      chartsProvider.moveBrushToEnd();
      // this.brushBeforeSimStarted = chartsProvider.getCurrentBrush();
      this.config.overrideBrushNumDays = Math.min(Math.ceil(chartsProvider.getBrushSize().tradingDays), Math.round(this.brushThreshold[1]));
      // chartsProvider.clearBrush();
    } else {
      this.config.overrideBrushNumDays = Math.round(this.brushThreshold[1]);
    }

    this.lastBreakTimestamp = performance.now();
    this.lastSecondTime = performance.now();
    await this.sendEvent("start");
    this.newStep();
  }

  private setCycles() {
    this.idleTime = 0;
    const targetStepsInASecond = Math.floor(this.targetSpeed * this.performanceMargin);
//   console.log(`Traget speed = ${this.targetSpeed}`);
    const fastestTimeToReachTarget = targetStepsInASecond * this.lastStepDuration;
//    console.log(`fastest time to reach target = ${fastestTimeToReachTarget}`);
    const excessTimeInASecond = 1000 - fastestTimeToReachTarget;
    if (excessTimeInASecond < this.lastBreakDuration) {
      this.currentCycleSize = 0;
      return;
    }

//    console.log("Last break duration: ", this.lastBreakDuration);
    let maxBreaksInSecond = Math.min(Math.floor(excessTimeInASecond / this.lastBreakDuration), this.maxBreaksPerSecond);
//    console.log(`max breaks second = ${maxBreaksInSecond}, this.maxBreaksPerSecond = ${this.maxBreaksPerSecond}`);
    if (targetStepsInASecond < maxBreaksInSecond) {
      maxBreaksInSecond = targetStepsInASecond;
//      console.log(`max breaks second revised = ${maxBreaksInSecond}`);
      this.idleTime = 1000 / targetStepsInASecond - (this.lastBreakDuration + this.lastStepDuration);
      const timeSinceLastBreak = performance.now() - this.lastBreakTimestamp;
      const timeToNextBreak = this.breakTime - timeSinceLastBreak;
      this.idleTime = Math.min(timeToNextBreak, this.idleTime);
//      console.log("idletime = ", this.idleTime);
      if (this.idleTime < 20) {
        this.idleTime = 0;
      }
//      console.log("revised idletime = ", this.idleTime);
    }

    if (maxBreaksInSecond == this.maxBreaksPerSecond) {
//      console.log(`max breaks second revised = ${maxBreaksInSecond}`);
      this.idleTime = 1000 / maxBreaksInSecond - (this.lastBreakDuration + this.lastStepDuration);
      const timeSinceLastBreak = performance.now() - this.lastBreakTimestamp;
      const timeToNextBreak = this.breakTime - timeSinceLastBreak;
      this.idleTime = Math.min(timeToNextBreak, this.idleTime);
//      console.log("idletime = ", this.idleTime);
      if (this.idleTime < 20) {
        this.idleTime = 0;
      }
//     console.log("revised idletime = ", this.idleTime);
    }

    let breaksPerSecond = Math.max(this.minBreaksPerSecond, maxBreaksInSecond);
//   console.log("breaks per second = ", breaksPerSecond);
    this.currentCycleSize = Math.floor(targetStepsInASecond / breaksPerSecond);
    if (this.currentCycleSize == 0) {
      this.currentCycleSize = 1;
    }
//   console.log("cycle size = ", this.currentCycleSize);
  }

  private async newBreak() {
    if (!this._running) {
      return;
    }
//    console.log("NEWBREAK START:", performance.now() - this.lastSecondTime);
    let t0 = performance.now();

    if (this._realtimeSpeed == 0) {
      this._realtimeSpeed = this._targetSpeed;
    }
    await this.break();
    this.breakIndex++;
    if (this.breakIndex % this.breaksPerMajorBreak == 0) {
      await this.majorBreak();
    }

    if (performance.now() - this.lastSecondTime >= 1000) {
//     console.log("NEW SECOND");
      if (!this.simWarmedUp && performance.now() - this.startTimestamp >= 2000) {
        this.simWarmedUp = true;
      }
      this._realtimeSpeed = this.stepsThisSecond;
//     console.log("ACTUAL SPEED = ", this.stepsThisSecond);
      this.lastSecondTime = performance.now();
      this.stepsThisSecond = 0;
    }
    this.lastBreakDuration = performance.now() - t0;
    this.setCycles();
//    console.log("NEWBREAK END:", performance.now() - this.lastSecondTime);
    this.lastBreakTimestamp = performance.now();
    if (this.idleTime != 0) {
      //     console.log("scheduling for : ", this.idleTime);
      setTimeout(this.newStep.bind(this), this.idleTime);
    } else {
      this.newStep();
    }
  }
  //HOT
  private async newStep() {
    if (!this._running) {
      return;
    }
    if ((performance.now() - this.lastBreakTimestamp) >= Math.max(this.breakTime, this.idleTime)) {
      this.newBreak();
      return;
    }

    if (this.stepsThisSecond >= this._targetSpeed) {
      this.newBreak();
      return;
    }

    if (this.engineData.dateKeyIndex == (this.engineData.currentData.length - 1)) {
      await this._stop();
      await this.sendEvent("end");
      return;
    }

    const t0 = performance.now();
    await this.step(this.useBot);
    this.stepsThisSecond++;
    this.lastStepDuration = performance.now() - t0;

    if (this.firstStepSinceStart) {
      this.firstStepSinceStart = false;
      this.newBreak();
      return;
    }

    if (this.currentCycleSize) {
      this.currentCycleIndex++;
      //     console.log(`Cycle index: ${this.currentCycleIndex}, timesteamp: ${performance.now() - this.startTimestamp}`);
      if (this.currentCycleIndex >= this.currentCycleSize) {
        this.currentCycleIndex = 0;
        this.newBreak();
        return;
      }
    }

    this.newStep();
  }
}