import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-batch-mates',
  templateUrl: './member-batch-mates.component.html',
  styleUrls: ['./member-batch-mates.component.css']
})
export class MemberBatchMatesComponent implements OnInit {
  members: Member[];
  
  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadMembersByBatch();
  }

  loadMembersByBatch() {
    this.memberService.getMemberByBatch().subscribe(response => {
      this.members = response;
    })
  }
}
