import { EntranceMajor } from "./../../model/EntranceMajor";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import { combineLatest, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class EntranceMajorService {
  constructor(private firestore: AngularFirestore) {}

  getAllEntranceMajorBySchoolName(schoolName: string) {
    return this.firestore
      .collectionGroup("EntranceMajor", (query) =>
        query.where("schoolName", "==", schoolName)
      )
      .snapshotChanges()
      .pipe(
        map((result) =>
          result.map((item) => {
            const doc = item.payload.doc;
            return {
              id: doc.id,
              ref: doc.ref,
              ...(doc.data() as EntranceMajor),
            } as EntranceMajor;
          })
        )
      );
  }
}
