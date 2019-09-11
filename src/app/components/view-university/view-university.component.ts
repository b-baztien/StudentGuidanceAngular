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

  lat = 51.678418;
  lng = 7.809007;

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
      zoom: 13,
      center: myLatlng,
      scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
      styles: [{
        "featureType": "water",
        "stylers": [{
          "saturation": 43
        }, {
          "lightness": -11
        }, {
          "hue": "#0088ff"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
          "hue": "#ff0000"
        }, {
          "saturation": -100
        }, {
          "lightness": 99
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#808080"
        }, {
          "lightness": 54
        }]
      }, {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#ece2d9"
        }]
      }, {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#ccdca1"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#767676"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#ffffff"
        }]
      }, {
        "featureType": "poi",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#b8cb93"
        }]
      }, {
        "featureType": "poi.park",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "poi.sports_complex",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "poi.medical",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "poi.business",
        "stylers": [{
          "visibility": "simplified"
        }]
      }]

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
      // this[0].major_name = 'test';
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