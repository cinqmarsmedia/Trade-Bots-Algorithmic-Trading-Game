import { DataOhlc } from '../charts/charts';
import * as tw from 'trendyways';

const period=1;
/*
  Generated class for the SupstanceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
type Line = (null | number | [number, Date, Date] | [number, Date, number]);
class Supstance {
  constructor() {
  }
  public currentData: Line[];
  //calculate the horizontal lines using the ohlc data
  calculate(data: DataOhlc, algorithm: any): Line[] {
    switch (algorithm.name.toLowerCase()) {
      case "floor": {
        const floorValues = tw.floorPivots(data.slice(data.length - 1).map(x => ({ c: x.close, h: x.high, l: x.low })))
        const { pl, r1, r2, r3, s1, s2, s3 } = floorValues[0].floor;
        this.currentData = [pl, r1, r2, r3, s1, s2, s3]
        break;
      }


      case "woodie": {

    const woodieValues = tw.woodiesPoints(data.slice(data.length - period).map(x => ({ c: x.close, h: x.high, l: x.low })))
    const { pivot, r1, r2, s1, s2 } = woodieValues[0].wood;
var r3=woodieValues[0].h+ 2*(pivot-woodieValues[0].l);
var s3=woodieValues[0].l - 2*(woodieValues[0].h-pivot);

        this.currentData = [pivot, r1, r2, r3, s1, s2, s3];
        break;
      }

  case "camarilla": {
    const camValues = tw.camarillaPoints(data.slice(data.length - period).map(x => ({ c: x.close, h: x.high, l: x.low })))
    console.log(camValues);
    const { r1, r2, r3, s1, s2, s3,s4,r4 } = camValues[0].cam;
        this.currentData = [(r1+s1)/2, r2, r3, r4, s2, s3, s4];
        break;
      }

   case "fibonacci": {
    const fib = tw.fibonacciRetrs(data.slice(data.length - period).map(x => ({ c: x.close, h: x.high, l: x.low })))
        this.currentData = [(fib[2]+fib[3])/2, fib[2], fib[1], fib[0], fib[3], fib[4], fib[5]];
        break;
      }


    }
    return this.currentData;
  }
}

const supstance = new Supstance();

export { supstance as Supstance }
