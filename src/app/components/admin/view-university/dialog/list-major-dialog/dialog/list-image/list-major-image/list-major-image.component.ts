import { AngularFireStorage } from "@angular/fire/storage";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-list-major-image",
  templateUrl: "./list-major-image.component.html",
  styleUrls: ["./list-major-image.component.css"],
})
export class ListMajorImageComponent implements OnInit {
  @Input() listImageLocal: string[];

  listImageUrl: string[];

  constructor(private afStorage: AngularFireStorage) {}

  ngOnInit() {
    this.listImageUrl = new Array(this.listImageLocal.length);
    if (this.listImageLocal) {
      for (let i = 0; i < this.listImageLocal.length; i++) {
        this.afStorage.storage
          .ref(this.listImageLocal[i])
          .getDownloadURL()
          .then((url) => {
            this.listImageUrl[i] = url;
          });
      }
    }
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
