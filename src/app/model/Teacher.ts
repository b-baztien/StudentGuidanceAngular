import { DocumentReference } from '@angular/fire/firestore';

export class Teacher {
    id?: string;
    ref?: DocumentReference;
    firstname: string;
    lastname: string;
    department: string;
    position: string;
    phone_no: string;
    email: string;
    image: string = '';
    school: DocumentReference;
    login: DocumentReference;
}