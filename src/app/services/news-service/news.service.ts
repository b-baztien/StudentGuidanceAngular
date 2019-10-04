import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { News } from 'src/app/model/News';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private firestore: AngularFirestore) {
  }

  getAllNews() {
    return this.firestore.collection('News').snapshotChanges();
  }

  addNews(news: News) {
    return this.firestore.collection('News').add(Object.assign({}, news));
  }

  getNews(news_id : string) {
    return this.firestore.collection('News').doc(news_id).snapshotChanges();
  }
}
