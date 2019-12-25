import { DocumentReference } from '@angular/fire/firestore';

export class Career {
    career_name: string;
    image: string = '';
    description: string;
    major: DocumentReference[] = new Array<DocumentReference>();
}