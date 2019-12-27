import { DocumentReference } from '@angular/fire/firestore';

export class Major
 {
    major_name: string;
    career: DocumentReference[] = new Array<DocumentReference>();
    url: string;
    entrance_detail: string;
}