import { DocumentReference } from '@angular/fire/firestore';
import { Faculty } from './Faculty';
import { element } from 'protractor';

export class University {
    university_name: string;
    address: string;
    url: string;
    phone_no: string;
    university_detail: string;
    zone: string;
    view: number;
    image: string;
    location: firebase.firestore.GeoPoint;
    faculty: DocumentReference[];
}