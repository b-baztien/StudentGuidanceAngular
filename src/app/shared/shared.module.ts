import { ThaiYearPipe } from "./../pipe/thai-year.pipe";
import { MatProgressButtonsModule } from "mat-progress-buttons";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PhonePipe } from "../pipe/phone.pipe";
import { UserTypePipe } from "../pipe/user-type.pipe";
import { ChartModule } from "angular2-chartjs";
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatCardModule,
  MatIconModule,
  MatStepperModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatChipsModule,
  MatSortModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatListModule,
  MatTreeModule,
  MatDividerModule,
  MatTabsModule,
} from "@angular/material";
import { SatNativeDateModule, SatDatepickerModule } from "saturn-datepicker";

@NgModule({
  declarations: [PhonePipe, UserTypePipe, ThaiYearPipe],
  imports: [CommonModule],
  exports: [
    PhonePipe,
    UserTypePipe,
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatChipsModule,
    MatSortModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatListModule,
    MatTreeModule,
    MatDividerModule,
    MatProgressButtonsModule,
    MatTabsModule,
    SatDatepickerModule,
    SatNativeDateModule,
    ChartModule,
    ThaiYearPipe,
  ],
})
export class SharedModule {}
