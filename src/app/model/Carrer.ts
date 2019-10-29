import { DocumentReference } from '@angular/fire/firestore';

export class Carrer {
    carrer_name: string;
    image: string;
    description: string;
    major: DocumentReference[] = new Array<DocumentReference>();
}