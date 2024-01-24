import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousands'
})
export class ThousandSuffixesPipe implements PipeTransform {

  transform(input: any, args?: any): any {
    var exp,
      suffixes = ['k', 'M', 'B', 'T', 'P', 'E'];
      var neg=''

    if (Number.isNaN(input)) {
      return null;
    }

    if (input<0){
      neg='-';
    }

    input=Math.abs(input);

    if (input < 1000) {
      return neg+String(input.toFixed(args));
    }

    if (input>=1000000000000000000){
return String(input.toPrecision(3)).replace('+','')
}

    exp = Math.floor(Math.log(input) / Math.log(1000));

    return neg+(input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];


  }

}