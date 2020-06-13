import { DocumentReference } from "@angular/fire/firestore";
export class Tcas {
  id?: string;
  ref?: DocumentReference;
  startDate: firebase.firestore.Timestamp = null;
  endDate: firebase.firestore.Timestamp = null;
  round: string = null;
  entranceAmount: number = null;
  url: string = null;
}
