import * as firebase from 'firebase/app';
import { DocumentReference } from '@angular/fire/firestore';

export class News {
    id?: string;
    ref?: DocumentReference;
    detail: string;
    image: string;
    topic: string;
    start_time: firebase.firestore.Timestamp;
    schoolName: string;
    teacherName: string;
    listUniversity_name: string[];
}