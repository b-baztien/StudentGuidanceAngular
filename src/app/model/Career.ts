import { DocumentReference } from '@angular/fire/firestore';

export class Career {
    id?: string;
    ref?: DocumentReference;
    career_name: string;
    image: string;
    description: string;
}