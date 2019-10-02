import { DocumentReference } from '@angular/fire/firestore';

export class Major
 {
    major_name: string;
    carrer: DocumentReference[];
    url: string;
    entrance_detail: string;
    faculty: DocumentReference;
}