import { DocumentReference } from '@angular/fire/firestore';

export class Faculty {
    id?: string;
    ref?: DocumentReference;
    faculty_name: string;
    facultyIcon: string;
    url: string;
}