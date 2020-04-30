import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Tcas } from "src/app/model/Tcas";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-view-major-tcas",
  templateUrl: "./view-major-tcas.component.html",
  styleUrls: ["./view-major-tcas.component.css"],
})
export class ViewMajorTcasComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewMajorTcasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tcas
  ) {
    if (!isNullOrUndefined(data)) console.log({ data });
  }

  ngOnInit() {}
}
