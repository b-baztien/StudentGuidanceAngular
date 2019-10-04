import { firestore } from 'firebase';
import { DocumentReference } from '@angular/fire/firestore';

export class News {
    detail: string;
    image: string;
    topic: string;
    start_time: firestore.Timestamp;
    end_time: firestore.Timestamp;
    teacher: DocumentReference;
    university: DocumentReference[];
}