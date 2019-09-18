import { DocumentReference } from '@angular/fire/firestore';
import { Faculty } from './Faculty';
import { firestore } from 'firebase';

export class University {
    university_name: string;
    address: string;
    url: string;
    phone_no: string;
    university_detail: string;
    zone: string;
    view: number;
    image: DocumentReference;
    location: firestore.GeoPoint;

    faculty: Faculty[];
}