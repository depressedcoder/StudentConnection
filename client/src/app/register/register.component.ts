import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 @Output() cancelRegister = new EventEmitter();
 
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];
  Batch: any = [
    'MIT 15',
    'MIT 16',
    'MIT 17',
    'MIT 18',
    'MIT 19',
    'MIT 20',
    'MIT 21',
    'MIT 22'
  ]

  constructor(private accountService:AccountService, private toastr: ToastrService,
     private fb: FormBuilder,private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 20);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      studentId: ['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]],
      dateOfBirth: ['',Validators.required],
      gender: ['male'],
      city: ['',Validators.required],
      country: ['',Validators.required],
      isAlumni: [false],
      batch: ['',Validators.required]
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const controls = control?.parent?.controls as { [key: string]: AbstractControl; };
      let matchToControl = null;    
      if(controls) matchToControl = controls[matchTo];       
      return control?.value === matchToControl?.value
        ? null : { isMatching: true }
    }
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe(response => {
      // this.router.navigateByUrl('/members');
      this.toastr.success('Sign Up Successful.');
      this.registerForm.reset();
    }, error=> {
      this.validationErrors = error;
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
