import { firestore } from 'firebase';

export class News {
    detail: string;
    image: string;
    topic: string;
    start_time: firestore.Timestamp;
    end_time: firestore.Timestamp;
}