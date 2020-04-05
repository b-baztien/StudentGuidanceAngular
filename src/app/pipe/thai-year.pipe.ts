import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "thaiYear"
})
export class ThaiYearPipe implements PipeTransform {
  transform(year: string): string {
    try {
      return (+year + 543).toString();
    } catch (error) {
      return year;
    }
  }
}
