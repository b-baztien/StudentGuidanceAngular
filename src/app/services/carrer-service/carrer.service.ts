import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Carrer } from 'src/app/model/Carrer';
import { AngularFireStorage } from '@angular/fire/storage';
import { Major } from 'src/app/model/Major';

@Injectable({
  providedIn: 'root'
})
export class CarrerService {
  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) {
  }

  getAllCarrer() {
    return this.firestore.collection('Carrer').snapshotChanges();
  }

  getCarrer(carrerId: string) {
    return this.firestore.collection('Carrer').doc(carrerId).snapshotChanges();
  }

  getCarrerByMajor(majorRef: DocumentReference) {
    return this.firestore.collection('Carrer').ref.where('major', '==', majorRef).get();
  }

  async addCarrer(carrer: Carrer) {
    try {
      return await this.firestore.collection('Carrer').doc(carrer.carrer_name).ref.get().then(async carrerRes => {
        if (!carrerRes.exists) { //ถ้าข้อมูล Carrer เก่าใน Database ยังไม่มี ให้ เพิ่มข้อมูล Carrer ลงไป
          this.firestore.collection('Carrer').doc(carrer.carrer_name).set(Object.assign({}, carrer));
        } else { //ถ้าข้อมูล Carrer เก่าใน Database มีแล้ว ให้เช็คว่า Major ใน Carrer ซ้ำหรือไม่
          const carrerData: Carrer = carrerRes.data() as Carrer;
          if (carrerData.major !== undefined) {
            carrer.major.forEach(majorNewRef => {
              let dupMajor = false;
              carrerData.major.forEach(majorOldRef => {
                dupMajor = majorNewRef.id == majorOldRef.id;
              });
              if (!dupMajor) {
                carrerData.major.push(majorNewRef);
              }
            });
          } else {
            carrerData.major = carrer.major;
          }
          this.firestore.collection('Carrer').doc(carrer.carrer_name).set(Object.assign({}, carrerData));
        }
        return this.firestore.collection('Carrer').doc(carrer.carrer_name).ref;
      });
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  updateCarrer(carrer: Carrer) {
    try {
      this.firestore.collection('Carrer').doc(carrer.carrer_name).set(Object.assign({}, carrer));
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  deleteCarrer(carrerRef: QueryDocumentSnapshot<unknown>) {
    try {
      const carrer = carrerRef.data() as Carrer;
      if (carrer.image !== undefined) {
        this.afStorage.storage.ref(carrer.image).delete();
      }
      this.firestore.collection('Major').ref.where('carrer', 'array-contains', carrerRef.ref).onSnapshot(result => {
        result.forEach(docsRs => {
          const major = docsRs.data() as Major;
          for (let i = 0; i < major.carrer.length; i++) {
            if (major.carrer[i].id == carrerRef.id) {
              major.carrer.splice(i, 1);
              this.firestore.collection('Major').doc(docsRs.id).set(Object.assign({}, major));
            }
          }
        });
        this.firestore.collection('Carrer').doc(carrer.carrer_name).delete();
      });
    } catch (error) {
      console.log(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  async deleteMajorInCarrer(major: DocumentReference) {
    return await this.firestore.collection('Carrer').ref.where('major', '==', major).get().then(async result => {
      if (!result.empty) {
        await result.docs.forEach(carrerRef => {
          let carrer = carrerRef.data() as Carrer;
          for (let i = 0; i < carrer.major.length; i++) {
            if (carrer.major[i].id == major.id) {
              carrer.major.splice(i, 1);
              this.firestore.collection('Carrer').doc(carrerRef.id).update(Object.assign({}, carrer));
            }
          }
        });
      }
    });
  }
}
