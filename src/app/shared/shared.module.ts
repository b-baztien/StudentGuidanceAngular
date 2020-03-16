import { MatProgressButtonsModule } from "mat-progress-buttons";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PhonePipe } from "../pipe/phone.pipe";
import { UserTypePipe } from "../pipe/user-type.pipe";
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
  MatDividerModule
} from "@angular/material";

@NgModule({
  declarations: [PhonePipe, UserTypePipe],
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
    MatProgressButtonsModule
  ]
})
export class SharedModule {}
