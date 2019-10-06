import { DocumentReference } from '@angular/fire/firestore';

export class Student {
    student_id: string;
    firstname: DocumentReference;
    lastname: string;
    image: string;
    email: string;
    entry_year: string;
    phone_no: string;
    junior_school: string;
    gender: string;
    student_status: string;
    study_plan: string;
    school: DocumentReference;
    entrance_exam_result: DocumentReference[];
    favorite_carrer: DocumentReference[];
    favorite_university: DocumentReference[];
}