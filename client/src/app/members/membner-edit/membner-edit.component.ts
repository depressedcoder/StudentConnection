import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-membner-edit',
  templateUrl: './membner-edit.component.html',
  styleUrls: ['./membner-edit.component.css']
})
export class MembnerEditComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm;
  member: Member;
  user: User;
  blogForm = this.formBuilder.group({
    title: '',
    description: ''
  });
  config: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '20rem',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService,private memberService: MembersService, private toastr: ToastrService,private formBuilder: FormBuilder) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
   }
   
  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.memberService.getMember(this.user.username).subscribe(member => this.member = member);
  }

  updateMember() {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success('Profile updated Successfully');
      this.editForm.reset(this.member);
    })
  }
  addBlog() {
    this.memberService.addBlog(this.blogForm.value).subscribe(() => {
      this.toastr.success("Blog Added Successfull");
      this.blogForm.reset();
    })
  }

  
}
