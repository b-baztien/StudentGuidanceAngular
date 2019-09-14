import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Faculty } from 'src/app/model/Faculty';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Major } from 'src/app/model/Major';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddMajorDialog } from './dialog/add-major-dialog';
import { ListMajorDialog } from './dialog/list-major-dialog';
import { AddEditFacultyDialog } from './dialog/add-edit-faculty-dialog';

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
  listMajor: Major[] | null;
  uniOsb;

  facultyLtb: MatTableDataSource<Faculty>;
  displayedColumns: string[] = ['faculty_name', 'url', 'major', 'manage'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private universityService: UniversityService) { }

  async ngOnInit() {
    this.listMajor = new Array<Major>();
    const university_id = this.route.snapshot.paramMap.get('university_id');
    if (university_id === null) {
      window.location.replace('/admin');
    }
    await this.getUniversity(university_id);
    await this.getMap();
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
      title: "Hello World!"
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
  }

  async getUniversity(university_id: string) {
    let listFaculty: Array<Faculty> = new Array<Faculty>();
    this.uniOsb = await this.universityService.getUniversity(university_id).subscribe(response => {
      this.university = response.payload.data() as University;
      this.university.faculty.forEach(listFacultyRef => {
        listFacultyRef.get().then(facultyRef => {
          listFaculty.push(facultyRef.data() as Faculty);
          facultyRef.data().major.forEach(listMajorRef => {
            listMajorRef.get().then(majorRef => {
              this.listMajor.push(majorRef.data() as Major);
            });
          });
          this.facultyLtb = new MatTableDataSource<Faculty>(listFaculty);
          this.facultyLtb.paginator = this.paginator;
        });
      });
    });
  }

  openAddMajorDialog(faculty: Faculty): void {
    const dialogRef = this.dialog.open(AddMajorDialog, {
      width: '50%',
      data: faculty,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this[0].major_name = 'test';
    });
  }

  openAddEditFacultyDialog(faculty: Faculty): void {
    const dialogRef = this.dialog.open(AddEditFacultyDialog, {
      width: '50%',
      data: faculty,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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