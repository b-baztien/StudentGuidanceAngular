import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Faculty } from 'src/app/model/Faculty';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Major } from 'src/app/model/Major';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ListMajorDialog } from './dialog/list-major-dialog';
import { AddEditFacultyDialogComponent } from './dialog/add-edit-faculty-dialog/add-edit-faculty-dialog.component';
import { FacultyService } from 'src/app/services/faculty-service/faculty.service';
import { AddMajorDialogComponent } from './dialog/add-major-dialog/add-major-dialog.component';

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

  constructor(private universityService: UniversityService, private facultyService: FacultyService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit() {
    const university_id = this.route.snapshot.paramMap.get('university');
    if (university_id === null) {
      window.location.replace('/admin');
    }
    await this.getUniversity(university_id).then(() => {
      // this.getMap();
    });
  }

  getMap() {
    var myLatlng = new google.maps.LatLng(40.748817, -73.985428);
    var mapOptions = {
      zoom: 16,
      center: myLatlng,
      scrollwheel: false,
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var marker = new google.maps.Marker({
      position: myLatlng,
      title: this.university.university_name,
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
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
      this.showContent = undefined === this.university ? false : true;
    });
  }

  openAddMajorDialog(faculty: Faculty): void {
    const dialogRef = this.dialog.open(AddMajorDialogComponent, {
      width: '50%',
      data: faculty,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this[0].major_name = 'test';
    });
  }

  openAddEditFacultyDialog(faculty?: Faculty): void {
    const dialogRef = this.dialog.open(AddEditFacultyDialogComponent, {
      width: '50%',
      data: faculty ? faculty : null,
    });

    dialogRef.afterClosed().subscribe(facultyRs => {
      if (facultyRs.faculty !== null) {
        if(facultyRs.mode === 'เพิ่ม') {
        this.facultyService.addFaculty(this.university, facultyRs.faculty);
        } else if(facultyRs.mode === 'แก้ไข') {
          this.facultyService.updateFaculty(this.university, facultyRs.faculty);
        }
      }
    });
  }

  openListMajorDialog(faculty: Faculty): void {
    const dialogRef = this.dialog.open(ListMajorDialog, {
      width: '50%',
      data: faculty,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this[0].major_name = 'test';
    });
  }

  ngOnDestroy(): void {
    this.uniOsb.unsubscribe();
  }
}