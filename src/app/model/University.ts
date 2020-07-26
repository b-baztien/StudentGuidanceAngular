import { DocumentReference } from "@angular/fire/firestore";

export class University {
  id?: string;
  ref?: DocumentReference;
  university_name: string;
  url: string;
  phone_no: string;
  university_detail: string;
  view: number;
  image: string = "";
  albumImage: string[] = new Array<string>();
  address: string;
  tambon: string;
  amphur: string;
  province: string;
  zipcode: string;
  zone: string;
}
