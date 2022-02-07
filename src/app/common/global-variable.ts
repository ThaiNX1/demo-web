import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalVariable {
  public showdDropdownMenu: Subject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  setshowdDropdownMenu(showDropdown: boolean) {
    this.showdDropdownMenu.next(showDropdown);
  }
}
