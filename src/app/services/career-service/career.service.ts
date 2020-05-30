import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Career } from "src/app/model/Career";
import { AngularFireStorage } from "@angular/fire/storage";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CareerService {
  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  getAllCareer() {
    return this.firestore
      .collectionGroup("Career", (query) => query.orderBy("career_name"))
      .snapshotChanges()
      .pipe(map((result) => result.map((item) => item.payload.doc)));
  }

  getCareer(careerId: string) {
    return this.firestore.collection("Career").doc(careerId).snapshotChanges();
  }

  getAllCareerByMajorReference(majorRef: DocumentReference) {
    return this.firestore
      .collection(majorRef.parent)
      .doc(majorRef.id)
      .collection("Career", (query) => query.orderBy("career_name"))
      .snapshotChanges()
      .pipe(map((result) => result.map((item) => item.payload.doc)));
  }

  async addCareer(career: Career) {
    try {
      await this.firestore
        .collection("Career")
        .doc(career.career_name)
        .get()
        .toPromise()
        .then((result) => {
          if (result.exists) return;
          this.firestore
            .collection("Career")
            .doc(career.career_name)
            .set(Object.assign({}, career));
        });
    } catch (error) {
      console.error(error);
      throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง");
    }
  }

  async addAllCareer(listCareer: Career[]) {
    try {
      listCareer.forEach(async (career) => {
        await this.firestore
          .collection("Career")
          .doc(career.career_name)
          .get()
          .toPromise()
          .then((result) => {
            if (result.exists) return;
            this.firestore
              .collection("Career")
              .doc(career.career_name)
              .set(Object.assign({}, career));
          });
      });
    } catch (error) {
      console.error(error);
      throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง");
    }
  }

  updateCareer(career: Career) {
    try {
      this.firestore
        .collection("Career")
        .doc(career.career_name)
        .update(Object.assign({}, career));
    } catch (error) {
      console.error(error);
      throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง");
    }
  }

  async deleteCareer(careerRef: DocumentReference) {
    const firestoreDoc = this.firestore
      .collection(careerRef.parent)
      .doc(careerRef.id);
    try {
      firestoreDoc
        .snapshotChanges()
        .pipe(map((docs) => docs.payload))
        .subscribe(async (result) => {
          const career = {
            id: result.id,
            ref: result.ref,
            ...(result.data() as Career),
          };
          if (career.image) {
            (
              await this.afStorage.storage
                .ref("career")
                .child(career.ref.id)
                .listAll()
            ).items.forEach((file) => {
              file.delete();
            });
          }
          await firestoreDoc.delete();
        });
    } catch (error) {
      console.error(error);
      throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง");
    }
  }
}
