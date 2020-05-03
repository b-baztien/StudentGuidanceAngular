import { DocumentReference } from "@angular/fire/firestore";
import { Tcas } from "./Tcas";

export class Major {
  id?: string;
  ref?: DocumentReference;
  majorName: string;
  albumImage: string[] = new Array<string>();
  url: string;
  tcasEntranceRound: any;
  certificate: string;
  courseDuration: string;
  tuitionFee: string;
  listCareerName?: string[];
}
