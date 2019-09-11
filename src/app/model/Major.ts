import { DocumentReference } from '@angular/fire/firestore';

export class Major
 {
    major_name: string;
    carrer: DocumentReference[];
    url: string;
    faculty: DocumentReference;
}