import { Injectable } from '@angular/core';
import { AngularFirestore, Action, DocumentSnapshot, DocumentChangeAction } from '@angular/fire/firestore';
import { University } from 'src/app/model/University';
import { AngularFireStorage } from '@angular/fire/storage';
import { Faculty } from 'src/app/model/Faculty';
import { CareerService } from '../career-service/career.service';
import { Major } from 'src/app/model/Major';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private careerService: CareerService,
  ) {
  }

  ngOnInit() {
  }

  async addUniversity(universityId: string, university: University) {
    try {
      return await this.firestore.collection('University').ref.where('university_name', '==', university.university_name)
        .get().then(universityRes => {
          if (universityRes.empty) {
            this.firestore.collection('University').doc(universityId).set(Object.assign({}, university));
            return universityId;
          } else {
            throw new Error('มีข้อมูลมหาวิทยาลัยนี้อยู่ในระบบแล้ว');
          }
        })
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อมผิดพลาดในการเพิ่มข้อมูล กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  updateUniversity(universityId: string, university: University) {
    try {
      return this.firestore.collection('University').doc(universityId).update(Object.assign({}, university));
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อมผิดพลาดในการแก้ไข กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  deleteUniversity(universityId: string) {
    try {
      this.firestore.collection('University').doc(universityId).snapshotChanges().subscribe(result => {
        const university = result.payload.data() as University;
        if (undefined !== university.image || undefined !== university.albumImage) {
          this.afStorage.ref(`university${universityId}`).delete();
        }
        if (undefined !== university.faculty) {
          university.faculty.forEach(fct => {
            this.firestore.collection('Faculty').doc(fct.id).snapshotChanges().subscribe(async facRef => {
              let faculty = facRef.payload.data() as Faculty;
              for (let i = 0; i < faculty.major.length; i++) {
                this.firestore.collection('Major').doc(faculty.major[i].id).snapshotChanges().subscribe(async mj => {
                  console.log('major 1');
                  console.log(mj.payload.data());
                  let major = mj.payload.data() as Major;
                  if (major.career !== undefined) {
                    await this.careerService.deleteMajorInCareer(mj.payload.ref).then(async () => {
                      await this.firestore.collection('Major').doc(faculty.major[i].id).delete();
                    });
                  }
                });
                if (i === faculty.major.length - 1) {
                  this.firestore.collection('Faculty').doc(fct.id).delete();
                }
              }
              if (faculty.major === undefined) {
                this.firestore.collection('Faculty').doc(fct.id).delete();
              }
            });
          });
        }
        this.firestore.collection('University').doc(universityId).delete();
      });
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อมผิดพลาดในการลบ กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  getAllUniversity(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('University').snapshotChanges();
  }

  getUniversity(university_id: string): Observable<Action<DocumentSnapshot<unknown>>> {
    return this.firestore.collection('University').doc(university_id).snapshotChanges();
  }

  async getUniversityByUniversityName(university_name: string) {
    return await this.firestore.collection('University').ref.where('university_name', '==', university_name)
      .get().then(async result => {
        return await result.docs[0].exists ? result.docs[0].ref : null;
      });
  }
}
