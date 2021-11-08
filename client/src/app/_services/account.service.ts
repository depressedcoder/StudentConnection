import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1); //how many previous user gonna store. Storing the current User
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http:HttpClient, private presence: PresenceService) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if(user) {
          user.roles = [];
          const roles = this.getDecodedToken(user.token).role;
          Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
          localStorage.setItem('user', JSON.stringify(user));

          this.currentUserSource.next(user);
          this.presence.createHubConnection(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if(user) {
          // localStorage.setItem('user', JSON.stringify(user));
          // this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user?: User) {
    if(user == null)
    {
      this.currentUserSource.next();
    }
    else{
      user.roles = [];
      const roles = this.getDecodedToken(user.token).role;
      Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
      
      this.currentUserSource.next(user);
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next();
    this.presence.stopHubConnection();
  }

  getDecodedToken(token:string){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
