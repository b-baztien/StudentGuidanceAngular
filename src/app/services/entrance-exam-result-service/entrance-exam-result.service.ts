import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EntranceExamResultService {

  constructor(private firestore: AngularFirestore, ) { }

  async deleteMajorInExamResult(major: DocumentReference) {
    return await this.firestore.collection('EntranceExamResult').ref.where('major', '==', major).get().then(result => {
      result.forEach(eneRs => {
        this.firestore.collection('EntranceExamResult').doc(eneRs.id).delete();
      });
    });
  }
}
