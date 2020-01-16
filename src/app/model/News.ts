import * as firebase from 'firebase/app';
import { DocumentReference } from '@angular/fire/firestore';

export class News {
    id?: string;
    ref?: DocumentReference;
    detail: string;
    image: string = '';
    topic: string;
    start_time: firebase.firestore.Timestamp;
    end_time: firebase.firestore.Timestamp;
    university: DocumentReference[] = new Array<DocumentReference>();
}