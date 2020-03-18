import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { University } from "src/app/model/University";
import { AngularFireStorage } from "@angular/fire/storage";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UniversityService {
  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit() {}

  async addUniversity(universityId: string, university: University) {
    const firestoreCol = this.firestore.collection("University");
    try {
      if (
        !(
          await firestoreCol.ref
            .where("university_name", "==", university.university_name)
            .get()
        ).empty
      ) {
        throw new Error("มีข้อมูลมหาวิทยาลัยนี้อยู่ในระบบแล้ว");
      }
      await firestoreCol.doc(universityId).set(Object.assign({}, university));
      return universityId;
    } catch (error) {
      console.error(error);
      if (error.message === "มีข้อมูลมหาวิทยาลัยนี้อยู่ในระบบแล้ว") {
        throw error;
      } else {
        throw new Error(
          "เกิดข้อมผิดพลาดในการเพิ่มข้อมูล กรุณาลองใหม่อีกครั้งภายหลัง"
        );
      }
    }
  }

  async updateUniversity(universityId: string, university: University) {
    try {
      return await this.firestore
        .collection("University")
        .doc(universityId)
        .update(Object.assign({}, university));
    } catch (error) {
      console.error(error);
      throw new Error("เกิดข้อมผิดพลาดในการแก้ไข กรุณาลองใหม่อีกครั้งภายหลัง");
    }
  }

  deleteUniversity(universityId: string) {
    try {
      this.firestore
        .collection("University")
        .doc(universityId)
        .snapshotChanges()
        .pipe(map(docs => docs.payload.data()))
        .subscribe(async result => {
          const university = result as University;
          if (university.image || university.albumImage) {
            (
              await this.afStorage.storage
                .ref("university")
                .child(universityId)
                .listAll()
            ).items.forEach(file => {
              file.delete();
            });
          }
          this.firestore
            .collection("University")
            .doc(universityId)
            .delete();
        });
    } catch (error) {
      console.error(error);
      throw new Error("เกิดข้อมผิดพลาดในการลบ กรุณาลองใหม่อีกครั้งภายหลัง");
    }
  }

  getAllUniversity() {
    return this.firestore
      .collection("University", query => query.orderBy("university_name"))
      .snapshotChanges()
      .pipe(
        map(result =>
          result.map(item => {
            const doc = item.payload.doc;
            return {
              id: doc.id,
              ref: doc.ref,
              ...(doc.data() as University)
            } as University;
          })
        )
      );
  }

  getUniversity(university_id: string) {
    return this.firestore
      .collection("University")
      .doc(university_id)
      .snapshotChanges();
  }

  getUniversityByUniversityName(university_name: string) {
    return this.firestore
      .collection("University", query =>
        query.where("university_name", "==", university_name)
      )
      .snapshotChanges()
      .pipe(map(result => result.map(item => item.payload.doc)));
  }
}
