import { DocumentReference } from "@angular/fire/firestore";

export class EntranceExamResult {
  id?: string;
  ref?: DocumentReference;
  entrance_exam_name: string;
  year: string;
  university: string;
  schoolName: string;
  faculty: string;
  major: string;
}
