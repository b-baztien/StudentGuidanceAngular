import { EntranceExamResult } from "./../../model/EntranceExamResult";
import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class EntranceExamResultService {
  constructor(private firestore: AngularFirestore) {}

  getAllExamResultBySchoolName(schoolName: string) {
    return this.firestore
      .collectionGroup("EntranceExamResult", (query) =>
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
              ...(doc.data() as EntranceExamResult),
            } as EntranceExamResult;
          })
        )
      );
  }

  getCountExamResultBySchoolNameAndYear(schoolName: string, year: string) {
    return this.firestore
      .collectionGroup("EntranceExamResult", (query) =>
        query
          .where("schoolName", "==", schoolName)
          .where("year", "==", year ? year : "")
      )
      .snapshotChanges()
      .pipe(
        map((result) => {
          return result.length;
        })
      );
  }

  async deleteMajorInExamResult(major: DocumentReference) {
    return await this.firestore
      .collection("EntranceExamResult")
      .ref.where("major", "==", major)
      .get()
      .then((result) => {
        result.forEach((eneRs) => {
          this.firestore
            .collection("EntranceExamResult")
            .doc(eneRs.id)
            .delete();
        });
      });
  }

  async deleteEntranceExamResult(id: string) {
    try {
      await this.firestore.collection("EntranceExamResult").doc(id).delete();
    } catch (error) {
      console.error(error);
      throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง");
    }
  }
}
