import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LogInComponent implements OnInit, ErrorStateMatcher {
  
  loginForm = new FormGroup({
    username: new FormControl(null, [
      Validators.required]),
    password: new FormControl(null, [
      Validators.required]),
  });

  @Output() loginClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm);
    }
  }
}