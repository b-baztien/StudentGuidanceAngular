import { DocumentReference } from '@angular/fire/firestore';

export class Faculty {
    faculty_name: string;
    major: DocumentReference[];
    url: string;
    university: DocumentReference;
}