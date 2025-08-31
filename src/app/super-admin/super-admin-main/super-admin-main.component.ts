import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverallCookieInterface } from '../../login_registration/core/overallCookieInterface';
import { OverallCookieModel } from '../../login_registration/core/overallCookieModel';

@Component({
  selector: 'app-super-admin-main',
  templateUrl: './super-admin-main.component.html',
  styleUrl: './super-admin-main.component.scss',
  standalone: false
})
export class SuperAdminMainComponent implements OnInit {

  // Holds CSS style for sidebar visibility
  sidebarClasses = '';

  // Tracks which component/tab is currently activated (default is 'subList')
  activatedComp: string = 'subList';

  // Controls the visibility state of the sidebar (true = visible)
  isSidebarActive = true;
  // Store the cookie interface
  overallCookieInterface: OverallCookieInterface;
  // Inject Router for navigation
  constructor(private router: Router) {
    this.overallCookieInterface = new OverallCookieModel();
  }

  // Toggle sidebar visibility and adjust styles accordingly
  toggleSideMenu() {
    if (this.isSidebarActive) {
      this.sidebarClasses = 'margin-left: -264px;'; // Hide sidebar
    } else {
      this.sidebarClasses = 'margin-left: 0px;'; // Show sidebar
    }
    this.isSidebarActive = !this.isSidebarActive; // Toggle the state
  }

  // Logout function: navigates to login page
  logout() {
    this.router.navigate(['/login']);
  }

  // Switch active component/tab and persist selection in localStorage
  navFunction(item: string) {
    this.activatedComp = item;
    localStorage.setItem('supAdminActivatedComp', item); // Store tab selection
  }

  // OnInit: Load active tab from localStorage if it exists
  ngOnInit() {


    if (!this.overallCookieInterface.GetUserToken()) {
      // Optionally clear ghostEmail or any other localStorage items
      localStorage.removeItem('ghostEmail');
      // Clear cookies and session data via interface method
      this.overallCookieInterface.ClearCookies();
      // Navigate to logout
      this.router.navigate(['login']);

    }

    const storedComp = localStorage.getItem('supAdminActivatedComp');
    if (storedComp) {
      this.activatedComp = storedComp; // Restore previously selected tab
    }
  }
}
