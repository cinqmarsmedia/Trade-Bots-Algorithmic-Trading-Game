class BaklavaState {

    public state = {stockInfo:false,maxSim:1,unlock:0,portState:0,testState:0,year:-1,gains:false};
    public setState(key: string, value: any){
        this.state[key] = value;
    }
    public getState(key: string){
        return this.state[key]
    }
}

const baklavaState = new BaklavaState();

export { baklavaState as BaklavaState }
