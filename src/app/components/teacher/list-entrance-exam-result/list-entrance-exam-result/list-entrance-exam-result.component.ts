import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { Chart } from "chart.js";
import { EntranceExamResultService } from "src/app/services/entrance-exam-result-service/entrance-exam-result.service";

@Component({
  selector: "app-list-entrance-exam-result",
  templateUrl: "./list-entrance-exam-result.component.html",
  styleUrls: ["./list-entrance-exam-result.component.css"],
})
export class ListEntranceExamResultComponent implements OnInit {
  lineChart: Chart;
  yearControl = new FormControl("", Validators.required);
  setYear: Set<string>;
  chartUniData: Map<string, Map<string, number>> = new Map<
    string,
    Map<string, number>
  >();
  chartFacData: Map<string, Map<string, number>> = new Map<
    string,
    Map<string, number>
  >();
  chartMajorData: Map<string, Map<string, number>> = new Map<
    string,
    Map<string, number>
  >();

  constructor(
    public dialog: MatDialog,
    private entranceExamResuleService: EntranceExamResultService
  ) {}

  ngOnInit() {
    const school = localStorage.getItem("school");
    this.entranceExamResuleService
      .getAllExamResultBySchoolName(school)
      .subscribe((result) => {
        this.setYear = new Set(result.map((exam) => exam.year));
        result.forEach((exam) => {
          //set university chart data
          if (this.chartUniData.has(exam.year)) {
            if (this.chartUniData.get(exam.year).has(exam.university)) {
              this.chartUniData
                .get(exam.year)
                .set(
                  exam.university,
                  this.chartUniData.get(exam.year).get(exam.university) + 1
                );
              console.log(this.chartUniData);
            } else {
              this.chartUniData.get(exam.year).set(exam.university, 1);
            }
          } else {
            this.chartUniData.set(
              exam.year,
              new Map<string, number>().set(exam.university, 1)
            );
          }

          //set faculty chart data
          if (this.chartFacData.has(exam.year)) {
            if (this.chartFacData.get(exam.year).has(exam.faculty)) {
              this.chartFacData
                .get(exam.year)
                .set(
                  exam.faculty,
                  this.chartFacData.get(exam.year).get(exam.faculty) + 1
                );
            } else {
              this.chartFacData.get(exam.year).set(exam.faculty, 1);
            }
          } else {
            this.chartFacData.set(
              exam.year,
              new Map<string, number>().set(exam.faculty, 1)
            );
          }

          //set major chart data
          if (this.chartMajorData.has(exam.year)) {
            if (this.chartMajorData.get(exam.year).has(exam.major)) {
              this.chartMajorData
                .get(exam.year)
                .set(
                  exam.major,
                  this.chartMajorData.get(exam.year).get(exam.major) + 1
                );
            } else {
              this.chartMajorData.get(exam.year).set(exam.major, 1);
            }
          } else {
            this.chartMajorData.set(
              exam.year,
              new Map<string, number>().set(exam.major, 1)
            );
          }
        });
      });
  }

  onYearChange() {
    if (this.yearControl.valid) {
      //generate university chart
      let uniCount = new Array();
      this.chartUniData.get(this.yearControl.value).forEach((count) => {
        uniCount.push(count);
      });

      this.lineChart = new Chart("uniChart", {
        type: "doughnut",
        data: {
          labels: [...this.chartUniData.get(this.yearControl.value).keys()],
          datasets: [
            {
              data: uniCount,
              backgroundColor: [
                "#00CAE3",
                "#55B559",
                "#F55145",
                "#A72ABD",
                "#FF9E0F",
              ],
            },
          ],
        },
        options: {
          title: {
            text: "จำนวนผลการสอบติดใน มหาวิทยาลัย",
            fontFamily: "Kanit",
            fontSize: "15",
            display: true,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      });

      //generate faculty chart
      let facCount = new Array();
      this.chartFacData.get(this.yearControl.value).forEach((count) => {
        facCount.push(count);
      });

      this.lineChart = new Chart("facChart", {
        type: "doughnut",
        data: {
          labels: [...this.chartFacData.get(this.yearControl.value).keys()],
          datasets: [
            {
              data: facCount,
              backgroundColor: [
                "#00CAE3",
                "#55B559",
                "#F55145",
                "#A72ABD",
                "#FF9E0F",
              ],
            },
          ],
        },
        options: {
          title: {
            text: "จำนวนผลการสอบติดใน คณะ",
            fontFamily: "Kanit",
            fontSize: "15",
            display: true,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      });

      //generate major chart
      let majorCount = new Array();
      this.chartMajorData.get(this.yearControl.value).forEach((count) => {
        majorCount.push(count);
      });

      this.lineChart = new Chart("majorChart", {
        type: "doughnut",
        data: {
          labels: [...this.chartMajorData.get(this.yearControl.value).keys()],
          datasets: [
            {
              data: majorCount,
              backgroundColor: [
                "#00CAE3",
                "#55B559",
                "#F55145",
                "#A72ABD",
                "#FF9E0F",
              ],
            },
          ],
        },
        options: {
          title: {
            text: "จำนวนผลการสอบติดใน สาขา",
            fontFamily: "Kanit",
            fontSize: "15",
            display: true,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      });
    }
  }
}
