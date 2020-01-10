import { DocumentReference } from '@angular/fire/firestore';

export class Alumni {
    graduated_year: string;
    job: string;
    status: string;
    school: DocumentReference;
    student: DocumentReference;
    major: DocumentReference;
}