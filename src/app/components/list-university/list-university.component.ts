import { Component, OnInit, ViewChild } from '@angular/core';
import { University } from 'src/app/model/University';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { UniversityService } from 'src/app/services/university-service/university.service';

@Component({
  selector: 'app-list-university',
  templateUrl: './list-university.component.html',
  styleUrls: ['./list-university.component.css']
})
export class ListUniversityComponent implements OnInit {
  universityList: MatTableDataSource<University>;
  displayedColumns: string[] = ['university_name', 'phone_no', 'url', 'view', 'zone'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private router: Router, private universityService: UniversityService) { }

  async ngOnInit() {
    await this.universityService.getAllUniversity().subscribe(result => {
      let resultListUniversity: Array<University> = new Array<University>();
      result.forEach(element => {
        resultListUniversity.push(element.payload.doc.data() as University);
      });
      this.universityList = new MatTableDataSource<University>(resultListUniversity);
      this.universityList.paginator = this.paginator;
    });
  }

  onUniversityClick(university) {
    this.router.navigate(['/admin/view-university']);
  }

}
