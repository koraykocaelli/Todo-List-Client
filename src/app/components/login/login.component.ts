import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  login() {
    this.authService.login(this.credentials).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', this.credentials.username);
        this.notificationService.showSuccess('Login successful', 'Success');
        this.router.navigate(['todos']);
      },
      err => {
        console.error(err);
        this.notificationService.showError('Login failed', 'Error');
      }
    );
  }
}