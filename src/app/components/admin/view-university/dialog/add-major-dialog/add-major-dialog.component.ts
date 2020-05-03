import { AngularFireStorage } from "@angular/fire/storage";
import { ENTER, SPACE } from "@angular/cdk/keycodes";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DocumentReference, AngularFirestore } from "@angular/fire/firestore";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Notifications } from "src/app/components/util/notification";
import { Career } from "src/app/model/Career";
import { Major } from "src/app/model/Major";
import { CareerService } from "src/app/services/career-service/career.service";
import { MajorService } from "src/app/services/major-service/major.service";

@Component({
  selector: "app-add-major-dialog",
  templateUrl: "./add-major-dialog.component.html",
  styleUrls: ["./add-major-dialog.component.css"],
})
export class AddMajorDialogComponent implements OnInit, AfterViewInit {
  majorForm = new FormGroup({
    majorName: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
    certificate: new FormControl(null, [Validators.required]),
    tuitionFee: new FormControl(null, [
      Validators.required,
      Validators.pattern("^[0-9]*$"),
    ]),
    courseDuration: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])
    ),
    career: new FormControl(null),
  });

  selectedCareer = new Array<string>();
  listAllCareer: string[] = new Array<string>();
  filteredCareer: Observable<string[]>;

  albumUrl: any[] = [
    "assets/img/no-photo-available.png",
    "assets/img/no-photo-available.png",
    "assets/img/no-photo-available.png",
    "assets/img/no-photo-available.png",
    "assets/img/no-photo-available.png",
  ];

  loadData = false;

  selectable = true;
  addOnBlur = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, SPACE];

  @ViewChild("careerInput", { static: false }) careerInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<AddMajorDialogComponent>,
    private majorService: MajorService,
    private careerService: CareerService,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: DocumentReference
  ) {}

  ngOnInit() {
    this.careerService.getAllCareer().subscribe((careerDocs) => {
      this.listAllCareer = careerDocs.map(
        (doc) => (doc.data() as Career).career_name
      );
      this.loadData = true;
    });
  }

  ngAfterViewInit() {
    this.filteredCareer = this.majorForm.get("career").valueChanges.pipe(
      startWith(null),
      map((career: string | null) =>
        career ? this._filter(career) : this.listAllCareer.slice()
      )
    );
  }

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }

  async upload(file, filePath) {
    const metadata = {
      contentType: "image/jpeg",
    };

    const fileName = this.afirestore.createId();
    if (file.type.split("/")[0] == "image") {
      return await this.afStorage
        .upload(`${filePath}/${fileName}`, file, metadata)
        .then(async (result) => {
          return result.ref.fullPath;
        });
    }
    return "";
  }

  previewAlbum(event) {
    for (let i = 0; i < 5; i++) {
      if (event.target.files[i] !== undefined) {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (_event) => {
          this.albumUrl[i] = reader.result;
        };
      } else {
        this.albumUrl[i] = "assets/img/no-photo-available.png";
      }
    }
  }

  addCareer(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || "").trim() && !this.selectedCareer.includes(value)) {
        this.selectedCareer.push(value.trim());
      }

      if (input) {
        input.value = "";
      }

      this.majorForm.get("career").setValue(null);
    }
  }

  removeCareer(career: string): void {
    const index = this.selectedCareer.indexOf(career);

    if (index >= 0) {
      this.selectedCareer.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedCareer.includes(event.option.viewValue)) {
      this.selectedCareer.push(event.option.viewValue);
    }
    this.careerInput.nativeElement.value = "";
    this.majorForm.get("career").setValue(null);
  }

  async onSubmit() {
    let major = new Major();
    if (this.majorForm.invalid || this.selectedCareer.length === 0) return;
    try {
      major.majorName = this.majorForm.get("majorName").value;
      major.url = this.majorForm.get("url").value;
      major.certificate = this.majorForm.get("certificate").value;
      major.courseDuration = this.majorForm.get("courseDuration").value;
      major.tuitionFee = this.majorForm.get("tuitionFee").value;
      major.listCareerName = this.selectedCareer;

      await this.careerService.addAllCareer(
        this.selectedCareer.map((career_name) => {
          let career = new Career();
          career.career_name = career_name;
          return career;
        })
      );

      let filePath = `major/`;
      let fileAlbum: any = document.getElementById("albumImage");
      major.albumImage =
        major.albumImage === undefined ? new Array<string>() : major.albumImage;
      for (let i = 0; i < fileAlbum.files.length; i++) {
        if (major.albumImage[i] !== undefined) {
          await this.afStorage.storage.ref(major.albumImage[i]).delete();
          major.albumImage[i] = await this.upload(
            fileAlbum.files[i],
            filePath
          ).then((result) => {
            return result;
          });
        } else {
          major.albumImage.push(
            await this.upload(fileAlbum.files[i], filePath).then((result) => {
              return result;
            })
          );
        }
      }

      await this.majorService.addMajor(this.data, major);
      new Notifications().showNotification(
        "done",
        "top",
        "right",
        "เพิ่มข้อมูลสาขาสำเร็จแล้ว",
        "success",
        "สำเร็จ !"
      );
    } catch (error) {
      new Notifications().showNotification(
        "close",
        "top",
        "right",
        error.message,
        "danger",
        "เพิ่มข้อมูลล้มเหลว !"
      );
    }
    this.dialogRef.close();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listAllCareer.filter((career) =>
      career.toLowerCase().includes(filterValue)
    );
  }
}
