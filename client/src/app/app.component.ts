import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  users: any;

  constructor(private accountService: AccountService, private presence: PresenceService){}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    if(localStorage.getItem('user') == null)
    {
      this.accountService.setCurrentUser(); //setting empty or null user
    }
    else{
      const user: User = JSON.parse(localStorage.getItem('user') || '{}');
      if(user){
        this.accountService.setCurrentUser(user);
        this.presence.createHubConnection(user);
      }
    }
    
  }

}
 