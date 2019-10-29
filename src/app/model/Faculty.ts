import { DocumentReference } from '@angular/fire/firestore';

export class Faculty {
    faculty_name: string;
    major: DocumentReference[] = new Array<DocumentReference>();
    url: string;
    university: DocumentReference;
}