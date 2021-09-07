import { Injectable } from '@angular/core';
import { CanDeactivate} from '@angular/router';
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
