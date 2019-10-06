import { firestore } from 'firebase';
import { DocumentReference } from '@angular/fire/firestore';

export class School {
    school_name: string;
    student: DocumentReference[];
    teacher: DocumentReference[];
}