import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MembnerEditComponent } from '../members/membner-edit/membner-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: MembnerEditComponent): boolean {
      if(component.editForm.dirty) {
        return confirm('Are you sure you want to continue? any unsaved changes will be lost');
      }
      return true;
  }
  
}
