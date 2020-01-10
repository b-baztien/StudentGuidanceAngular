import { DocumentReference } from '@angular/fire/firestore';

export class Student {
    id?: string;
    ref?: DocumentReference;
    firstname: string;
    lastname: string;
    image: string = '';
    email: string;
    entry_year: string;
    phone_no: string;
    junior_school: string;
    gender: string;
    student_status: string;
    study_plan: string;
    school: DocumentReference;
    login: DocumentReference;
    entrance_exam_result: DocumentReference[];
    favorite_career: DocumentReference[];
    favorite_university: DocumentReference[];
}