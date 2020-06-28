import { DocumentReference } from "@angular/fire/firestore";

export class EntranceMajor {
  id?: string;
  ref?: DocumentReference;
  entranceYear: string;
  facultyName: string;
  majorName: string;
  schoolName: string;
  universityName: string;
}
