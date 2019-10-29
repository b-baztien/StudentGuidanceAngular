import { DocumentReference } from '@angular/fire/firestore';

export class University {
    university_name: string;
    url: string;
    phone_no: string;
    university_detail: string;
    view: number;
    image: string;
    albumImage: string[] = new Array<string>();
    highlight: string[] = new Array<string>();
    address: string;
    tambon: string;
    amphur: string;
    province: string;
    zipcode: string;
    zone: string;
    faculty: DocumentReference[] = new Array<DocumentReference>();
}