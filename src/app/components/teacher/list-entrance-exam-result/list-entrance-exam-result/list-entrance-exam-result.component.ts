import { EntranceExamResult } from "./../../../../model/EntranceExamResult";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog, MatTableDataSource, MatSort } from "@angular/material";
import { Alumni } from "src/app/model/Alumni";
import { AlumniService } from "src/app/services/alumni-service/alumni.service";
import { EntranceExamResultService } from "src/app/services/entrance-exam-result-service/entrance-exam-result.service";
import { EntranceMajorService } from "./../../../../services/entrance-major-service/entrance-major.service";
import { EntranceMajor } from "src/app/model/EntranceMajor";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

interface SummaryData {
  universityName: string;
  facultyName: string;
  majorName: string;
  countExam: number;
  countEntrance: number;
}

@Component({
  selector: "app-list-entrance-exam-result",
  templateUrl: "./list-entrance-exam-result.component.html",
  styleUrls: ["./list-entrance-exam-result.component.css"],
})
export class ListEntranceExamResultComponent implements OnInit {
  lineChart: Chart;
  yearControl = new FormControl("", Validators.required);

  setYear: Set<string>;

  chartUniTCASData: Map<string, Map<string, number>> = new Map<
    string,
    Map<string, number>
  >();
  chartFacTCASData: Map<string, Map<string, number>> = new Map<
    string,
    Map<string, number>
  >();
  chartMajorTCASData: Map<string, Map<string, number>> = new Map<
    string,
    Map<string, number>
  >();

  chartUniEntranceData: Map<string, Map<string, number>> = new Map<
    string,
    Map<string, number>
  >();
  chartFacEntranceData: Map<string, Map<string, number>> = new Map<
    string,
    Map<string, number>
  >();
  chartMajorEntranceData: Map<string, Map<string, number>> = new Map<
    string,
    Map<string, number>
  >();

  listEntranceMajor: EntranceMajor[];
  listExamResult: EntranceExamResult[];

  summaryList: MatTableDataSource<SummaryData>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [
    "universityName",
    "facultyName",
    "majorName",
    "countExam",
    "countEntrance",
    "sumPercent",
  ];

  totalAlumni: number = 0;
  totalEntrance: number = 0;
  totalWork: number = 0;
  totalOther: number = 0;

  isFoundExam = false;
  isFoundEntrance = false;

  school: string;

  tooltip = {
    callbacks: {
      label: (tooltipItem, data) => {
        return (
          data["labels"][tooltipItem["index"]] +
          " : " +
          data["datasets"][0]["data"][tooltipItem["index"]] +
          " คน"
        );
      },
    },
  };

  constructor(
    public dialog: MatDialog,
    private entranceExamResuleService: EntranceExamResultService,
    private entranceMajorService: EntranceMajorService,
    private alumniService: AlumniService
  ) {}

  ngOnInit() {
    this.setYear = new Set();
    this.school = localStorage.getItem("school");

    this.listExamResult = [];

    //generate TCAS data
    this.entranceExamResuleService
      .getAllExamResultBySchoolName(this.school)
      .subscribe((result) => {
        result.forEach((examResultData) => {
          let isDup: boolean = false;
          this.listExamResult.forEach((examResult) => {
            //เช็คว่ามหาวิทยาลัย คณะ สาขา นี้มีใน list แล้วหรือยัง
            if (
              examResult.university == examResultData.university &&
              examResult.faculty == examResultData.faculty &&
              examResult.major == examResultData.major
            ) {
              //เช็ครอบ tcas นี้ เป็นของนักเรียนที่อยู่ใน list แล้วหรือยัง
              if (
                examResult.ref.parent.parent.id ==
                examResultData.ref.parent.parent.id
              ) {
                //มีข้อมูลใน list แล้ว
                isDup = true;
              }
            }
          });

          //เช็คว่าถ้ายังไม่มีข้อมูลใน list ให้ add ลง list
          if (!isDup) {
            this.listExamResult.push(examResultData);
          }
        });

        this.listExamResult.forEach((exam) => {
          this.setYear.add(exam.year);
        });

        this.listExamResult.forEach((exam) => {
          //set university chart data
          if (this.chartUniTCASData.has(exam.year)) {
            if (this.chartUniTCASData.get(exam.year).has(exam.university)) {
              this.chartUniTCASData
                .get(exam.year)
                .set(
                  exam.university,
                  this.chartUniTCASData.get(exam.year).get(exam.university) + 1
                );
            } else {
              this.chartUniTCASData.get(exam.year).set(exam.university, 1);
            }
          } else {
            this.chartUniTCASData.set(
              exam.year,
              new Map<string, number>().set(exam.university, 1)
            );
          }

          //set faculty chart data
          if (this.chartFacTCASData.has(exam.year)) {
            if (this.chartFacTCASData.get(exam.year).has(exam.faculty)) {
              this.chartFacTCASData
                .get(exam.year)
                .set(
                  exam.faculty,
                  this.chartFacTCASData.get(exam.year).get(exam.faculty) + 1
                );
            } else {
              this.chartFacTCASData.get(exam.year).set(exam.faculty, 1);
            }
          } else {
            this.chartFacTCASData.set(
              exam.year,
              new Map<string, number>().set(exam.faculty, 1)
            );
          }

          //set major chart data
          if (this.chartMajorTCASData.has(exam.year)) {
            if (this.chartMajorTCASData.get(exam.year).has(exam.major)) {
              this.chartMajorTCASData
                .get(exam.year)
                .set(
                  exam.major,
                  this.chartMajorTCASData.get(exam.year).get(exam.major) + 1
                );
            } else {
              this.chartMajorTCASData.get(exam.year).set(exam.major, 1);
            }
          } else {
            this.chartMajorTCASData.set(
              exam.year,
              new Map<string, number>().set(exam.major, 1)
            );
          }
        });
      });

    //generate alumni entrance major data
    this.entranceMajorService
      .getAllEntranceMajorBySchoolName(this.school)
      .subscribe((result) => {
        this.listEntranceMajor = [...result];
        result.forEach((entanceMajor) => {
          this.setYear.add(entanceMajor.entranceYear);
        });
        result.forEach((entranceMajor) => {
          //set university chart data
          if (this.chartUniEntranceData.has(entranceMajor.entranceYear)) {
            if (
              this.chartUniEntranceData
                .get(entranceMajor.entranceYear)
                .has(entranceMajor.universityName)
            ) {
              this.chartUniEntranceData
                .get(entranceMajor.entranceYear)
                .set(
                  entranceMajor.universityName,
                  this.chartUniEntranceData
                    .get(entranceMajor.entranceYear)
                    .get(entranceMajor.universityName) + 1
                );
            } else {
              this.chartUniEntranceData
                .get(entranceMajor.entranceYear)
                .set(entranceMajor.universityName, 1);
            }
          } else {
            this.chartUniEntranceData.set(
              entranceMajor.entranceYear,
              new Map<string, number>().set(entranceMajor.universityName, 1)
            );
          }

          //set faculty chart data
          if (this.chartFacEntranceData.has(entranceMajor.entranceYear)) {
            if (
              this.chartFacEntranceData
                .get(entranceMajor.entranceYear)
                .has(entranceMajor.facultyName)
            ) {
              this.chartFacEntranceData
                .get(entranceMajor.entranceYear)
                .set(
                  entranceMajor.facultyName,
                  this.chartFacEntranceData
                    .get(entranceMajor.entranceYear)
                    .get(entranceMajor.facultyName) + 1
                );
            } else {
              this.chartFacEntranceData
                .get(entranceMajor.entranceYear)
                .set(entranceMajor.facultyName, 1);
            }
          } else {
            this.chartFacEntranceData.set(
              entranceMajor.entranceYear,
              new Map<string, number>().set(entranceMajor.facultyName, 1)
            );
          }

          //set major chart data
          if (this.chartMajorEntranceData.has(entranceMajor.entranceYear)) {
            if (
              this.chartMajorEntranceData
                .get(entranceMajor.entranceYear)
                .has(entranceMajor.majorName)
            ) {
              this.chartMajorEntranceData
                .get(entranceMajor.entranceYear)
                .set(
                  entranceMajor.majorName,
                  this.chartMajorEntranceData
                    .get(entranceMajor.entranceYear)
                    .get(entranceMajor.majorName) + 1
                );
            } else {
              this.chartMajorEntranceData
                .get(entranceMajor.entranceYear)
                .set(entranceMajor.majorName, 1);
            }
          } else {
            this.chartMajorEntranceData.set(
              entranceMajor.entranceYear,
              new Map<string, number>().set(entranceMajor.majorName, 1)
            );
          }
        });
      });
  }

  onYearChange() {
    this.getCountAlumniData();

    if (this.yearControl.valid) {
      this.generateSummary(this.yearControl.value);
      let limitData = 5;

      //generate entrance university chart
      this.isFoundEntrance = this.generateChart(
        this.chartUniEntranceData,
        "uniEntranceChart",
        "สรุปผลสอบติด TCAS ในมหาวิทยาลัย",
        limitData
      );

      //generate entrance faculty chart
      this.generateChart(
        this.chartFacEntranceData,
        "facEntranceChart",
        "สรุปผลสอบติด TCAS ในคณะ",
        limitData
      );

      //generate TCAS university chart
      this.isFoundExam = this.generateChart(
        this.chartUniTCASData,
        "uniChart",
        "จำนวนผลการสอบติดใน มหาวิทยาลัย",
        limitData
      );

      //generate TCAS faculty chart
      this.generateChart(
        this.chartFacTCASData,
        "facChart",
        "จำนวนผลการสอบติดใน คณะ",
        limitData
      );

      //generate summary
    } else {
      this.isFoundExam = false;
      this.isFoundEntrance = false;
    }
  }

  generateSummary(year: string) {
    let listEducationName: {
      universityName: string;
      facultyName: string;
      majorName: string;
    }[] = [];

    this.listEntranceMajor.forEach((entranceMajor) => {
      if (entranceMajor.entranceYear == year) {
        const summaryData = {
          universityName: entranceMajor.universityName,
          facultyName: entranceMajor.facultyName,
          majorName: entranceMajor.majorName,
        };

        let isDup: boolean = false;
        listEducationName.forEach((educationName) => {
          if (
            educationName.universityName == summaryData.universityName &&
            educationName.facultyName == summaryData.facultyName &&
            educationName.majorName == summaryData.majorName
          ) {
            isDup = true;
          }
        });

        if (!isDup) {
          listEducationName.push(summaryData);
        }
      }
    });

    this.listExamResult.forEach((examResult) => {
      if (examResult.year == year) {
        const summaryData = {
          universityName: examResult.university,
          facultyName: examResult.faculty,
          majorName: examResult.major,
        };

        let isDup: boolean = false;
        listEducationName.forEach((educationName) => {
          if (
            educationName.universityName == summaryData.universityName &&
            educationName.facultyName == summaryData.facultyName &&
            educationName.majorName == summaryData.majorName
          ) {
            isDup = true;
          }
        });

        if (!isDup) {
          listEducationName.push(summaryData);
        }
      }
    });

    let listSummary: SummaryData[] = [];
    listEducationName.forEach((summary) => {
      let setCountEntrance = new Set();
      let setCountExam = new Set();
      this.listEntranceMajor.forEach((entranceMajor) => {
        if (
          entranceMajor.universityName == summary.universityName &&
          entranceMajor.facultyName == summary.facultyName &&
          entranceMajor.majorName == summary.majorName
        ) {
          setCountEntrance.add(entranceMajor.ref.parent.parent.id);
        }
      });

      this.listExamResult.forEach((examResult) => {
        if (
          examResult.university == summary.universityName &&
          examResult.faculty == summary.facultyName &&
          examResult.major == summary.majorName
        ) {
          setCountExam.add(examResult.ref.parent.parent.id);
        }
      });

      const summaryData: SummaryData = {
        universityName: summary.universityName,
        facultyName: summary.facultyName,
        majorName: summary.majorName,
        countExam: setCountExam.size,
        countEntrance: setCountEntrance.size,
      };

      listSummary.push(summaryData);
    });

    this.summaryList = new MatTableDataSource(listSummary);
    this.summaryList.sort = this.sort;
  }

  getCountAlumniData() {
    this.alumniService
      .getAlumniByGraduateYear(this.school, this.yearControl.value)
      .subscribe((result) => {
        let listAlumni: Alumni[] = [...result];
        this.totalAlumni = result.length;
        this.totalEntrance = listAlumni.filter(
          (alumni) => alumni.status === "ศึกษาต่อ"
        ).length;
        this.totalOther = listAlumni.filter(
          (alumni) => alumni.status === "ไม่ระบุ"
        ).length;
        this.totalWork = listAlumni.filter(
          (alumni) =>
            alumni.status !== "ศึกษาต่อ" && alumni.status !== "ไม่ระบุ"
        ).length;
      });
  }

  generateChart(
    chartData: Map<string, Map<string, number>>,
    chartId: string,
    chartTitle: string,
    limit?: number
  ) {
    if (limit) {
      const listKeyMap = Array.from(
        chartData.get(this.yearControl.value).keys()
      ).slice(limit);

      listKeyMap.forEach((keyMap) => {
        chartData.get(this.yearControl.value).delete(keyMap);
      });
    }

    let dataCount: number[] = new Array();
    chartData.get(this.yearControl.value).forEach((count) => {
      dataCount.push(count);
    });

    this.lineChart = new Chart(chartId, {
      type: "doughnut",
      data: {
        labels: [...chartData.get(this.yearControl.value).keys()],
        datasets: [
          {
            data: dataCount,
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
      plugins: [ChartDataLabels],
      options: {
        title: {
          text: chartTitle,
          fontFamily: "Kanit",
          fontSize: "15",
          display: true,
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 20,
            fontColor: "#111",
            padding: 15,
          },
        },
        tooltips: this.tooltip,
        plugins: {
          datalabels: {
            color: "#111",
            textAlign: "center",
            font: {
              lineHeight: 1.6,
            },
            formatter: function (value, ctx) {
              return value + " คน";
            },
          },
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

    return true;
  }
}
