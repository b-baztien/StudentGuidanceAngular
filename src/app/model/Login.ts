import { DocumentReference } from '@angular/fire/firestore';

export class Login {
    id?: string;
    ref?: DocumentReference;
    username: string;
    password: string;
    type: string;
    isNewLogin?: boolean;
}