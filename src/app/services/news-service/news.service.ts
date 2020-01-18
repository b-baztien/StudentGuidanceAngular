import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { News } from 'src/app/model/News';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { Teacher } from 'src/app/model/Teacher';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) {
  }

  getNewsByTeacherReference(teacher: DocumentReference) {
    return this.firestore.collection(teacher.parent.path).doc(teacher.id).collection('News').snapshotChanges()
      .pipe(map(result => result.map(item => item.payload.doc).map(doc => {
        return { id: doc.id, ref: doc.ref, ...doc.data() as News } as News;
      })));
  }

  getAllNewsOrderByDate() {
    return this.firestore.collection('News').ref.orderBy('start_time', 'desc').get();
  }

  addNews(teacherRef: DocumentReference, news: News) {
    return this.firestore.collection(teacherRef.parent.path).doc(teacherRef.id).collection('News')
      .add(Object.assign({}, news));
  }

  editNews(newsRef: DocumentReference, news: News) {
    console.log('news update', newsRef.id);
    return this.firestore.collection(newsRef.parent.path).doc(newsRef.id).update(Object.assign({}, news));
  }

  getNews(news_id: string) {
    return this.firestore.collection('News').doc(news_id).snapshotChanges();
  }

  deleteNews(news_id: string) {
    this.getNews(news_id).subscribe(result => {
      let news = result.payload.data() as News;
      this.afStorage.ref(news.image).delete();
    });
    this.firestore.collection('News').doc(news_id).delete();
  }
}
