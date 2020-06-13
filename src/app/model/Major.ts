import { DocumentReference } from "@angular/fire/firestore";

export class Major {
  id?: string;
  ref?: DocumentReference;
  majorName: string;
  detail: string;
  albumImage: string[] = new Array<string>();
  url: string;
  degree: string;
  tcasEntranceRound: any;
  certificate: string;
  listCareerName?: string[];
}
