import { DocumentReference } from '@angular/fire/firestore';
import { Career } from './Career';
import { Tcas } from './Tcas';

export class Major {
    id?: string;
    ref?: DocumentReference;
    major_name: string;
    url: string;
    tcasEntranceRound: Tcas[];
    certificate: string;
    courseDuration: string;
    career?: DocumentReference[];

}