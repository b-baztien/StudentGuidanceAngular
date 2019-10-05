import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { News } from 'src/app/model/News';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) {
  }

  getAllNews() {
    return this.firestore.collection('News').snapshotChanges();
  }

  getAllNewsOrderByDate() {
    return this.firestore.collection('News').ref.orderBy('start_time', 'desc').get();
  }

  addNews(news: News) {
    return this.firestore.collection('News').add(Object.assign({}, news));
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
