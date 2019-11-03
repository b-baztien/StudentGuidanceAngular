import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EntranceExamResultService {

  constructor(private firestore: AngularFirestore, ) { }

  getAllExamResult() {
    return this.firestore.collection('EntranceExamResult').snapshotChanges();
  }

  async deleteMajorInExamResult(major: DocumentReference) {
    return await this.firestore.collection('EntranceExamResult').ref.where('major', '==', major).get().then(result => {
      result.forEach(eneRs => {
        this.firestore.collection('EntranceExamResult').doc(eneRs.id).delete();
      });
    });
  }

  async deleteEntranceExamResult(id: string) {
    try {
      await this.firestore.collection('EntranceExamResult').doc(id).delete();
    } catch (error) {
      console.log(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }
}
