import { AngularFireStorage } from "@angular/fire/storage";
import { ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DocumentSnapshot, AngularFirestore } from "@angular/fire/firestore";
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
import { Career } from "src/app/model/Career";
import { Major } from "src/app/model/Major";
import { CareerService } from "src/app/services/career-service/career.service";
import { RegularExpressionUtil } from "src/app/model/util/RegularExpressionUtil";

@Component({
  selector: "app-edit-major",
  templateUrl: "./edit-major.component.html",
  styleUrls: ["./edit-major.component.css"],
})
export class EditMajorComponent implements OnInit {
  majorForm = new FormGroup({
    majorName: new FormControl(null, [Validators.required]),
    detail: new FormControl(null),
    url: new FormControl(null, [
      Validators.required,
      Validators.pattern(RegularExpressionUtil.urlReg),
    ]),
    certificate: new FormControl(null, [Validators.required]),
    degree: new FormControl(null, [Validators.required]),
    career: new FormControl(null),
  });

  listDegree = ["ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"];

  majorDoc: DocumentSnapshot<unknown>;
  selectedCareer: string[] = new Array<string>();
  listAllCareerName: string[] = new Array<string>();
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
  addOnBlur = false;
  removable = true;
  separatorKeysCodes: number[] = [];

  @ViewChild("careerInput", { static: false }) careerInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<EditMajorComponent>,
    private careerService: CareerService,
    private afStorage: AngularFireStorage,
    private afirestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: Major
  ) {}

  ngOnInit() {
    this.majorForm.get("majorName").setValue(this.data.majorName);
    this.majorForm.get("detail").setValue(this.data.detail);
    this.majorForm.get("url").setValue(this.data.url);
    this.majorForm.get("certificate").setValue(this.data.certificate);
    this.majorForm.get("degree").setValue(this.data.degree);
    this.majorForm.get("career").setValue([...this.data.listCareerName]);
    this.selectedCareer = [...this.data.listCareerName];

    if (this.data.albumImage) {
      for (let i = 0; i < this.data.albumImage.length; i++) {
        this.afStorage.storage
          .ref(this.data.albumImage[i])
          .getDownloadURL()
          .then((url) => {
            this.albumUrl[i] = url;
          });
      }
    }

    this.careerService.getAllCareer().subscribe((listCareerRes) => {
      listCareerRes.forEach((careerRes) => {
        const career = careerRes.data() as Career;
        this.listAllCareerName.push(career.career_name);
      });
      this.loadData = true;
    });
    this.filteredCareer = this.majorForm.get("career").valueChanges.pipe(
      startWith(null),
      map((career: string | null) =>
        career ? this._filter(career) : this.listAllCareerName.slice()
      )
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

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  addCareer(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || "").trim()) {
        this.selectedCareer.push(value.trim());
      }

      if (input) {
        input.value = "";
      }

      this.majorForm.get("career").setValue(null);
    }
  }

  clearInputCareer(): void {
    this.majorForm.get("career").setValue(null);
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
    if (this.majorForm.invalid && this.selectedCareer.length === 0) return;
    major.majorName = this.majorForm.get("majorName").value;
    major.detail = this.majorForm.get("detail").value;
    major.url = this.majorForm.get("url").value;
    major.certificate = this.majorForm.get("certificate").value;
    major.degree = this.majorForm.get("degree").value;
    major.listCareerName = this.selectedCareer;

    let filePath = `major/`;
    let fileAlbum: any = document.getElementById("albumImage");
    major.albumImage =
      this.data.albumImage === undefined
        ? new Array<string>()
        : this.data.albumImage;
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

    this.dialogRef.close(major);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listAllCareerName.filter((career) =>
      career.toLowerCase().includes(filterValue)
    );
  }
}
