import { DocumentReference } from '@angular/fire/firestore';

export class Teacher {
    firstname: string;
    lastname: string;
    phone_no: string;
    email: string;
    school: DocumentReference;
}