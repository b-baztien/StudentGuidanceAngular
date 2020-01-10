import { DocumentReference } from '@angular/fire/firestore';
import { UtilIcons } from './util/UtilIcons';

export class Faculty {
    id?: string;
    ref?: DocumentReference;
    faculty_name: string;
    facultyIcon: UtilIcons;
    url: string;
}