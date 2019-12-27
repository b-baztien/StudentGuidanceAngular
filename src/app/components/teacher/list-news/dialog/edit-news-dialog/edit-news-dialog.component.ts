import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { News } from 'src/app/model/News';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';
import { AddMajorDialogComponent } from 'src/app/components/admin/view-university/dialog/add-major-dialog/add-major-dialog.component';
import { NewsService } from 'src/app/services/news-service/news.service';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { University } from 'src/app/model/University';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-news-dialog',
  templateUrl: './edit-news-dialog.component.html',
  styleUrls: ['./edit-news-dialog.component.css']
})
export class EditNewsDialogComponent implements OnInit {
  newsForm = new FormGroup({
    topic: new FormControl(null, [Validators.required]),
    detail: new FormControl(null, [Validators.required]),
    start_time: new FormControl(null, [Validators.required]),
    end_time: new FormControl(null, [Validators.required]),
    university: new FormControl(null),
  });

  news: News = new News();
  listUniversity_name: string[] = new Array<string>();
  allUniversity: string[] = new Array<string>();
  filteredUniversity: Observable<string[]>;

  selectable = true;
  addOnBlur = false;
  removable = true;

  loadData = false;

  imgURL: any = 'assets/img/no-photo-available.png';

  @ViewChild('universityInput', { static: false }) universityInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AddMajorDialogComponent>,
    private newsService: NewsService,
    private universityService: UniversityService,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: DocumentReference,
  ) {

  }

  ngOnInit() {
    this.newsService.getNews(this.data.id).subscribe(async result => {
      this.news = result.payload.data() as News;
      this.newsForm.get('topic').setValue(this.news.topic);
      this.newsForm.get('detail').setValue(this.news.detail);
      this.newsForm.get('start_time').setValue(this.news.start_time.toDate());
      this.newsForm.get('end_time').setValue(this.news.end_time.toDate());
      this.afStorage.storage.ref(this.news.image).getDownloadURL().then(url => {
        this.imgURL = url;
      });
      this.universityService.getAllUniversity().subscribe(listUniRes => {
        listUniRes.forEach(uniRes => {
          const university = uniRes.payload.doc.data() as University;
          this.allUniversity.push(university.university_name);
          if (this.news.university !== undefined) {
            this.news.university.forEach(uni => {
              if (uniRes.payload.doc.id === uni.id) {
                this.listUniversity_name.push(university.university_name);
              }
            });
          }
        });
        this.loadData = true;
      });
    });
    this.filteredUniversity = this.newsForm.get('university').valueChanges.pipe(
      startWith(null),
      map((university: string | null) => university ? this._filter(university) : this.allUniversity.slice()));
  }

  async ngAfterViewInit() {
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  preview(event) {
    if (event.target.files[0] !== undefined) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    } else {
      this.afStorage.storage.ref(this.news.image).getDownloadURL().then(url => {
        this.imgURL = url;
      });
    }
  }

  async upload(event) {
    const metadata = {
      contentType: 'image/jpeg',
    };

    const fileName = this.afirestore.createId();
    if (event.files[0].type.split('/')[0] == 'image') {
      await this.afStorage.upload(`news/${fileName}`, event.files[0], metadata).then(async result => {
        this.news.image = result.ref.fullPath;
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }


  clearUniversity(): void {
    this.universityInput.nativeElement.value = null;
    this.newsForm.get('university').setValue(null);
  }


  removeUniversity(university: string): void {
    const index = this.listUniversity_name.indexOf(university);

    if (index >= 0) {
      this.listUniversity_name.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.listUniversity_name.push(event.option.viewValue);
    this.universityInput.nativeElement.value = null;
    this.newsForm.get('university').setValue(null);
  }

  async onSubmit() {
    this.news = new News;
    if (this.newsForm.valid) {
      try {
        this.news.topic = this.newsForm.get('topic').value;
        this.news.detail = this.newsForm.get('detail').value;
        this.news.start_time = this.newsForm.get('start_time').value;
        this.news.end_time = this.newsForm.get('end_time').value;

        const newsImage: any = document.getElementById('newsImage');
        if (newsImage.files[0] !== undefined) {
          await this.upload(document.getElementById('newsImage'));
        }

        const setUniversity = new Set(this.listUniversity_name);
        let listUniversityRef = new Array<DocumentReference>();
        if (setUniversity.size > 0) {
          setUniversity.forEach(async university_name => {
            this.universityService.getUniversityByUniversityName(university_name).then(universityRef => {
              if (universityRef != null) {
                listUniversityRef.push(universityRef);
              }
              if (setUniversity.size === listUniversityRef.length) {
                this.news.university = listUniversityRef;
                this.newsService.editNews(this.data.id, this.news);
              }
            });
          });
        } else {
          this.news.university = listUniversityRef;
          this.newsService.editNews(this.data.id, this.news);
        }
      }
      catch (error) {
        console.error(error);
      }
      this.dialogRef.close();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allUniversity.filter(university => university.toLowerCase().includes(filterValue));
  }
}
