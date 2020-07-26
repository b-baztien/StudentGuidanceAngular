import { isNullOrUndefined } from "util";
import { Tcas } from "src/app/model/Tcas";
import { map } from "rxjs/operators";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TcasService {
  constructor(private firestore: AngularFirestore) {}

  getAllTcas() {
    return this.firestore
      .collectionGroup("Tcas", (query) => query.orderBy("round"))
      .snapshotChanges()
      .pipe(map((docs) => docs.map((item) => item.payload.doc)));
  }

  async getAllTcasUniversity(universityRef: DocumentReference) {
    let listTcas = new Array<Tcas>();
    const facultySnapshot = await this.firestore
      .doc(universityRef.path)
      .collection("Faculty")
      .get()
      .toPromise();
    facultySnapshot.docs.forEach(async (facDoc) => {
      const majorSnapshot = await this.firestore
        .doc(facDoc.ref.path)
        .collection("Major")
        .get()
        .toPromise();
      majorSnapshot.forEach(async (majorDoc) => {
        const tcasSnapshot = await this.firestore
          .doc(majorDoc.ref.path)
          .collection("Tcas")
          .get()
          .toPromise();

        if (tcasSnapshot.empty) {
          return;
        }

        let listTcasData: Array<Tcas> = tcasSnapshot.docs.map((doc) => {
          return { id: doc.id, ref: doc.ref, ...(doc.data() as Tcas) };
        });

        if (listTcas.length == 0) {
          listTcas.push(...listTcasData);
        } else {
          let listTcasTemp = listTcasData.filter((tcasData) => {
            let findTcas = listTcas.find(
              (tcas) => tcas && tcas.round === tcasData.round
            );

            let round = findTcas ? findTcas.round : tcasData.round;

            return tcasData.round !== round;
          });

          listTcas.push(...listTcasTemp);
        }
      });
    });
    return listTcas;
  }

  getTcasByMajorReference(majorRef: DocumentReference) {
    return this.firestore
      .collection(majorRef.parent.path)
      .doc(majorRef.id)
      .collection("Tcas", (query) => query.orderBy("round"))
      .get()
      .pipe(map((docs) => docs.docs.map((item) => item)));
  }

  async addTcas(majorRef: DocumentReference, tcas: Tcas) {
    delete tcas.id;
    delete tcas.ref;
    try {
      await this.firestore
        .collection(majorRef.parent)
        .doc(majorRef.id)
        .collection("Tcas", (query) =>
          query.where("majorName", "==", tcas.round)
        )
        .get()
        .toPromise()
        .then(async (result) => {
          if (!result.empty) throw new Error("มี TCAS รอบนี้อยู่ในระบบแล้ว");
          await this.firestore
            .collection(majorRef.parent)
            .doc(majorRef.id)
            .collection("Tcas")
            .add(Object.assign({}, tcas));
        });
    } catch (error) {
      console.error(error);
      if (error.message == "มี TCAS รอบนี้อยู่ในระบบแล้ว") {
        throw error;
      } else {
        throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง");
      }
    }
  }

  async updateTcas(tcasRef: DocumentReference, tcas: Tcas) {
    delete tcas.id;
    delete tcas.ref;
    try {
      return await this.firestore
        .collection(tcasRef.parent)
        .doc(tcasRef.id)
        .update(Object.assign({}, tcas));
    } catch (error) {
      console.error(error);
      throw new Error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง");
    }
  }
}
