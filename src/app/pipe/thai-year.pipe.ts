import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "thaiYear",
})
export class ThaiYearPipe implements PipeTransform {
  transform(year: string): string {
    try {
      return new Date().getFullYear() - +year === 0
        ? (+year + 543).toString()
        : year;
    } catch (error) {
      return year;
    }
  }
}
