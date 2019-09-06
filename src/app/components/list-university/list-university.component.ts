import { Component, OnInit, ViewChild } from '@angular/core';
import { University } from 'src/app/model/University';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';

const ELEMENT_DATA: University[] = [
  {
    universityId: '1',
    universityName: 'มหาวิทยาลัยแม่โจ้',
    universityDetail: 'มหาวิทยาลัยเกษตร',
    address: 'มหาวิทยาลัยแม่โจ้ 63 หมู่ 4 ต.หนองหาร อ.สันทราย จ.เชียงใหม่ 50290',
    phoneNo: '053873000',
    url: 'https://www.mju.ac.th/',
    view: 1000000,
    zone: 'เหนือ'
  },
  {
    universityId: '2',
    universityName: 'มหาวิทยาลัยแม่โจ้ 2',
    universityDetail: 'มหาวิทยาลัยเกษตร',
    address: 'มหาวิทยาลัยแม่โจ้ 63 หมู่ 4 ต.หนองหาร อ.สันทราย จ.เชียงใหม่ 50290',
    phoneNo: '053873000',
    url: 'https://www.mju.ac.th/',
    view: 1000000,
    zone: 'เหนือ'
  },
];

@Component({
  selector: 'app-list-university',
  templateUrl: './list-university.component.html',
  styleUrls: ['./list-university.component.css']
})
export class ListUniversityComponent implements OnInit {
  universityList: MatTableDataSource<University>;
  displayedColumns: string[] = ['universityName', 'phoneNo', 'url', 'view', 'zone'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private router: Router) { }

  ngOnInit() {
    for (let i = 0; i < 30; i++) {
      ELEMENT_DATA.push(ELEMENT_DATA[0]);
    }
    this.universityList = new MatTableDataSource<University>(ELEMENT_DATA);
    this.universityList.paginator = this.paginator;
  }

  onUniversityClick(university) {
    console.log(university);
    alert(university);
    this.router.navigate(['view-university']);
  }

}
