import { firestore } from 'firebase';
import { DocumentReference } from '@angular/fire/firestore';

export class News {
    id?: string;
    ref?: DocumentReference;
    detail: string;
    image: string = '';
    topic: string;
    start_time: firestore.Timestamp;
    end_time: firestore.Timestamp;
    university: DocumentReference[] = new Array<DocumentReference>();
}