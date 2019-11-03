import { DocumentReference } from '@angular/fire/firestore';

export class EntranceExamResult {
    entrance_exam_name: string;
    year: string;
    student: DocumentReference;
    university: DocumentReference;
    school: DocumentReference;
    faculty: DocumentReference;
    major: DocumentReference;
}