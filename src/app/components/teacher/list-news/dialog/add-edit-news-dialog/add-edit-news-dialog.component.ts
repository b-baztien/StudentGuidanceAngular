import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';
import { AddMajorDialogComponent } from 'src/app/components/admin/view-university/dialog/add-major-dialog/add-major-dialog.component';
import { startWith, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { News } from 'src/app/model/News';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-add-edit-news-dialog',
  templateUrl: './add-edit-news-dialog.component.html',
  styleUrls: ['./add-edit-news-dialog.component.css']
})
export class AddEditNewsDialogComponent implements OnInit {
  newsForm = new FormGroup({
    topic: new FormControl(this.data != null ? this.data.topic : null, [Validators.required]),
    detail: new FormControl(this.data != null ? this.data.detail : null, [Validators.required]),
    start_time: new FormControl(this.data != null ? this.data.start_time.toDate() : null, [Validators.required]),
    end_time: new FormControl(this.data != null ? this.data.end_time.toDate() : null, [Validators.required]),
    university: new FormControl(null),
  });

  listUniversity_name: string[] = new Array<string>();
  allUniversity: string[] = new Array<string>();
  filteredUniversity: Observable<string[]>;

  selectable = true;
  addOnBlur = false;
  removable = true;

  loadData = false;

  mode = '';

  imgURL: any = 'assets/img/no-photo-available.png';

  @ViewChild('universityInput', { static: false }) universityInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AddMajorDialogComponent>,
    private universityService: UniversityService,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: News | undefined,
  ) {
    if (data !== null) {
      this.mode = 'แก้ไข';
      this.listUniversity_name = this.data.listUniversity_name;
    } else {
      this.mode = 'เพิ่ม';
    }
  }

  ngOnInit() {
    this.getAllUniversity();

    if (this.data !== null) {
      this.afStorage.storage.ref(this.data.image).getDownloadURL().then(url => {
        this.imgURL = url;
      });
    }
  }

  async ngAfterViewInit() {
    this.filteredUniversity = this.newsForm.get('university').valueChanges.pipe(
      startWith(null),
      map((university: string | null) => university ? this._filter(university) : this.allUniversity.slice()));
  }

  private getAllUniversity() {
    this.universityService.getAllUniversity().subscribe(universitys => {
      this.allUniversity = universitys.map(uni => uni.university_name);
      this.loadData = true;
    })
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
      this.imgURL = 'assets/img/no-photo-available.png';
    }
  }

  async upload(file: File, filePath: string, filename?: string) {
    const metadata = {
      contentType: 'image/jpeg',
    };

    const newFileName = filename ? filename : this.afirestore.createId();
    if (file.type.includes('image')) {
      return await this.afStorage.upload(`${filePath}/${newFileName}`, file, metadata).then(async result => {
        return result.ref.fullPath;
      });
    }
    return '';
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
    if (!this.listUniversity_name.includes(event.option.viewValue)) {
      this.listUniversity_name.push(event.option.viewValue);
    }
    this.universityInput.nativeElement.value = '';
    this.newsForm.get('university').setValue(null);
  }

  async onSubmit() {
    let news = new News();
    if (this.newsForm.valid) {
      try {
        news.topic = this.newsForm.get('topic').value;
        news.detail = this.newsForm.get('detail').value;
        news.start_time = this.newsForm.get('start_time').value;
        news.end_time = this.newsForm.get('end_time').value;
        news.listUniversity_name = this.listUniversity_name;

        let filePath = 'news';
        let fileLogo: any = document.getElementById('newsImage');
        if (fileLogo.files[0] !== undefined) {
          news.image = await this.upload(fileLogo.files[0], filePath, news.topic).then(result => {
            return result;
          });
        }
        this.dialogRef.close({ mode: this.mode, news: news });
      } catch (error) {
        console.error(error);
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allUniversity.filter(university => university.toLowerCase().includes(filterValue));
  }
}
