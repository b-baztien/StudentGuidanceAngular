import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Carrer } from 'src/app/model/Carrer';

@Injectable({
  providedIn: 'root'
})
export class CarrerService {
  constructor(
    private firestore: AngularFirestore,
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
  }

  updateCarrer(carrerId: string, carrer: Carrer) {
    this.firestore.collection('Carrer').doc(carrerId).set(Object.assign({}, carrer));
  }

  async deleteMajorInCarrer(major: DocumentReference) {
    await this.firestore.collection('Carrer').ref.where('major', '==', major).get().then(async result => {
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
