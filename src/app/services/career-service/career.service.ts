import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, QueryDocumentSnapshot, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Career } from 'src/app/model/Career';
import { AngularFireStorage } from '@angular/fire/storage';
import { Major } from 'src/app/model/Major';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) {
  }

  getAllCareer() {
    return this.firestore.collection('Career').snapshotChanges();
  }

  getCareer(careerId: string) {
    return this.firestore.collection('Career').doc(careerId).snapshotChanges();
  }

  getCareerByMajorReference(majorRef: DocumentReference) {
    return this.firestore.collection('Career').ref.where('major', '==', majorRef).get();
  }

  async addCareer(career: Career) {
    try {
      return await this.firestore.collection('Career').doc(career.career_name).ref.get().then(async careerRes => {
        if (!careerRes.exists) { //ถ้าข้อมูล Career เก่าใน Database ยังไม่มี ให้ เพิ่มข้อมูล Career ลงไป
          this.firestore.collection('Career').doc(career.career_name).set(Object.assign({}, career));
        } else { //ถ้าข้อมูล Career เก่าใน Database มีแล้ว ให้เช็คว่า Major ใน Career ซ้ำหรือไม่
          const careerData: Career = careerRes.data() as Career;
          if (careerData.major !== undefined) {
            career.major.forEach(majorNewRef => {
              let dupMajor = false;
              careerData.major.forEach(majorOldRef => {
                dupMajor = majorNewRef.id == majorOldRef.id;
              });
              if (!dupMajor) {
                careerData.major.push(majorNewRef);
              }
            });
          } else {
            careerData.major = career.major;
          }
          this.firestore.collection('Career').doc(career.career_name).set(Object.assign({}, careerData));
        }
        return this.firestore.collection('Career').doc(career.career_name).ref;
      });
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  updateCareer(career: Career) {
    try {
      this.firestore.collection('Career').doc(career.career_name).set(Object.assign({}, career));
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  deleteCareer(careerRef: QueryDocumentSnapshot<unknown>) {
    try {
      const career = careerRef.data() as Career;
      if (career.image !== undefined) {
        this.afStorage.storage.ref(career.image).delete();
      }
      this.firestore.collection('Major').ref.where('career', 'array-contains', careerRef.ref).onSnapshot(result => {
        result.forEach(docsRs => {
          const major = docsRs.data() as Major;
          for (let i = 0; i < major.career.length; i++) {
            if (major.career[i].id == careerRef.id) {
              major.career.splice(i, 1);
              this.firestore.collection('Major').doc(docsRs.id).set(Object.assign({}, major));
            }
          }
        });
        this.firestore.collection('Career').doc(career.career_name).delete();
      });
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  async deleteMajorInCareer(major: DocumentReference) {
    return await this.firestore.collection('Career').ref.where('major', '==', major).get().then(async result => {
      if (!result.empty) {
        result.docs.forEach(careerRef => {
          let career = careerRef.data() as Career;
          for (let i = 0; i < career.major.length; i++) {
            if (career.major[i].id == major.id) {
              career.major.splice(i, 1);
              this.firestore.collection('Career').doc(careerRef.id).update(Object.assign({}, career));
            }
          }
        });
      }
    });
  }
}
