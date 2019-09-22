import { Component, OnInit, ViewChild } from '@angular/core';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { ActivatedRoute } from '@angular/router';
import { Faculty } from 'src/app/model/Faculty';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ListMajorDialog } from './dialog/list-major-dialog';
import { AddEditFacultyDialogComponent } from './dialog/add-edit-faculty-dialog/add-edit-faculty-dialog.component';
import { FacultyService } from 'src/app/services/faculty-service/faculty.service';
import { AddMajorDialogComponent } from './dialog/add-major-dialog/add-major-dialog.component';
import { MajorService } from 'src/app/services/major-service/major.service';
import { MapsAPILoader } from '@agm/core';


declare const google: any;

@Component({
  selector: 'app-view-university',
  templateUrl: './view-university.component.html',
  styleUrls: ['./view-university.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewUniversityComponent implements OnInit {
  university: University;
  uniOsb;

  showContent: boolean = false;
  showTable: boolean = false;

  facultyLtb: MatTableDataSource<Faculty>;
  displayedColumns: string[] = ['faculty_name', 'url', 'major', 'manage'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private universityService: UniversityService,
    private facultyService: FacultyService,
    private majorService: MajorService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
  ) { }

  async ngOnInit() {
    const university_id = this.route.snapshot.paramMap.get('university');
    if (university_id === null) {
      window.location.replace('/admin');
    }
    await this.getUniversity(university_id);
  }

  getMap() {
    this.mapsAPILoader.load().then(() => {
      console.log(this.university.location);
      var myLatlng = new google.maps.LatLng(this.university.location.latitude, this.university.location.longitude);
      var mapOptions = {
        zoom: 16,
        center: myLatlng,
        scrollwheel: false,
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      var marker = new google.maps.Marker({
        position: myLatlng,
        title: this.university.university_name
      });

      marker.setMap(map);
    });
  }


  async getUniversity(university_id: string) {
    this.uniOsb = await this.universityService.getUniversity(university_id).subscribe(universityRes => {
      this.university = universityRes.payload.data() as University;
      this.facultyService.getAllFaculty(university_id).subscribe(listFctRes => {
        let listFaculty = new Array<Faculty>();
        listFctRes.forEach(fctRes => {
          listFaculty.push(fctRes.payload.doc.data() as Faculty);
        });
        this.university.faculty = listFaculty;
        this.facultyLtb = new MatTableDataSource<Faculty>(this.university.faculty);
        this.facultyLtb.paginator = this.paginator;
        this.showTable = this.facultyLtb.data.length === 0 ? false : true;
      })
        this.getMap();
        this.showContent = true;
    });
  }

  openAddMajorDialog(faculty: Faculty): void {
    const dialogRef = this.dialog.open(AddMajorDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.majorService.addMajor(this.university, faculty, result.major);
    });
  }

  openAddEditFacultyDialog(faculty?: Faculty): void {
    const dialogRef = this.dialog.open(AddEditFacultyDialogComponent, {
      width: '50%',
      data: faculty ? faculty : null,
    });

    dialogRef.afterClosed().subscribe(facultyRs => {
      if (facultyRs.faculty !== null) {
        if (facultyRs.mode === 'เพิ่ม') {
          this.facultyService.addFaculty(this.university, facultyRs.faculty);
        } else if (facultyRs.mode === 'แก้ไข') {
          this.facultyService.updateFaculty(this.university, facultyRs.faculty);
        }
      }
    });
  }

  openDeleteFacultyDialog(faculty: Faculty): void {
    this.facultyService.deleteFaculty(this.university, faculty);
  }

  openListMajorDialog(faculty: Faculty): void {
    const dialogRef = this.dialog.open(ListMajorDialog, {
      width: '50%',
      data: faculty,
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

  ngOnDestroy(): void {
    this.uniOsb.unsubscribe();
  }
}