import { EntranceExamResult } from "./../../model/EntranceExamResult";
import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class EntranceExamResultService {
  constructor(private firestore: AngularFirestore) {}

  getAllExamResultBySchoolName(schoolName: string) {
    return this.firestore
      .collectionGroup("EntranceExamResult", query =>
        query.where("schoolName", "==", schoolName)
      )
      .snapshotChanges()
      .pipe(
        map(result =>
          result.map(item => {
            const doc = item.payload.doc;
            return {
              id: doc.id,
              ref: doc.ref,
              ...(doc.data() as EntranceExamResult)
            } as EntranceExamResult;
          })
        )
      );
  }

  async deleteMajorInExamResult(major: DocumentReference) {
    return await this.firestore
      .collection("EntranceExamResult")
      .ref.where("major", "==", major)
      .get()
      .then(result => {
        result.forEach(eneRs => {
          this.firestore
            .collection("EntranceExamResult")
            .doc(eneRs.id)
            .delete();
        });
      });
  }

  async deleteEntranceExamResult(id: string) {
    try {
      await this.firestore
        .collection("EntranceExamResult")
        .doc(id)
        .delete();
    } catch (error) {
      console.error(error);
      throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง");
    }
  }
}
