import { DocumentReference } from '@angular/fire/firestore';

export class EntranceExamResult {
    id?: string;
    ref?: DocumentReference;
    entranceExamName: string;
    year: string;
    studentName: string;
    universityName: string;
    schoolName: string;
    facultyName: string;
    majorName: string;
}