import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { University } from 'src/app/model/University';
import { UniversityService } from 'src/app/services/university-service/university.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Faculty } from 'src/app/model/Faculty';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-view-university',
  templateUrl: './view-university.component.html',
  styleUrls: ['./view-university.component.css']
})
export class ViewUniversityComponent implements OnInit {
  university: University;
  uniOsb;

  facultyLtb: MatTableDataSource<Faculty>;
  displayedColumns: string[] = ['faculty_name', 'url'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private router: Router, private route: ActivatedRoute, private universityService: UniversityService) { }

  async ngOnInit() {
    console.log(this.facultyLtb);
    const university_id = this.route.snapshot.paramMap.get('university_id');
    if (university_id === null) {
      window.location.replace('/admin');
    }
    await this.getUniversity(university_id);
  }

  async getUniversity(university_id: string) {
    let listFaculty: Array<Faculty> = new Array<Faculty>();
    this.uniOsb = await this.universityService.getUniversity(university_id).subscribe(response => {
      this.university = response.payload.data() as University;
      this.university.faculty.forEach(element => {
        element.get().then(response => {
          listFaculty.push(response.data() as Faculty);
          this.facultyLtb = new MatTableDataSource<Faculty>(listFaculty);
          this.facultyLtb.paginator = this.paginator;
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.uniOsb.unsubscribe();
  }
}
