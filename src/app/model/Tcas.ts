import { DocumentReference } from "@angular/fire/firestore";
import { TcasScore } from "./util/TcasScore";
export class Tcas {
  id?: string;
  ref?: DocumentReference;
  round: string = null;
  examReference: string[] = null;
  entranceAmount: number = null;
  examFee: number = null;
  score: TcasScore[] = null;
  registerPropertie: string = null;
  remark: string = null;
}
