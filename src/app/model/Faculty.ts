import { DocumentReference } from '@angular/fire/firestore';
import { Major } from './Major';

export class Faculty {
    faculty_name: string;
    major: Major[];
    url: string;
    university: DocumentReference;
}