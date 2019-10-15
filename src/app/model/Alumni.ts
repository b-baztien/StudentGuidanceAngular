import { DocumentReference } from '@angular/fire/firestore';

export class Carrer {
    graduated_year: string;
    job: string;
    status: string;
    student: DocumentReference;
}