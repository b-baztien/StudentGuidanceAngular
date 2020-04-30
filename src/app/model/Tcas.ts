import { DocumentReference } from "@angular/fire/firestore";
import { TcasScore } from "./util/TcasScore";
export class Tcas {
  id?: string;
  ref?: DocumentReference;
  startDate: Date = null;
  endDate: Date = null;
  round: string = null;
  entranceAmount: number = null;
  examFee: number = null;
  score: TcasScore[] = new Array<TcasScore>();
  registerPropertie: string = null;
  remark: string = null;
}
