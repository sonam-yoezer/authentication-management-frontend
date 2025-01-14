import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupData = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  };

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordsMatch(): boolean {
    return this.signupData.password === this.signupData.confirmPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';

    // Basic validation
    if (!this.signupData.userName || 
        !this.signupData.email || 
        !this.signupData.password || 
        !this.signupData.confirmPassword || 
        !this.signupData.phoneNumber) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    // Check if passwords match
    if (!this.passwordsMatch()) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Remove confirmPassword before sending to API
    const signupPayload = {
      userName: this.signupData.userName,
      email: this.signupData.email,
      password: this.signupData.password,
      phoneNumber: this.signupData.phoneNumber
    };

    this.authService.signup(signupPayload).subscribe({
      next: () => {
        // After successful signup, navigate to login
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Signup failed:', error);
        this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
      }
    });
  }
  
}
