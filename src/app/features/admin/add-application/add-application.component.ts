import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Application {
  id: string;
  title: string;
  version: string;
  description: string;
  category: string;
  status: 'Running' | 'Not Running' | 'Maintenance';
  appUrl: string;
}

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.scss'
})
export class AddApplicationComponent {
  application: Application = {
    id: '',
    title: '',
    version: '',
    description: '',
    category: '',
    status: 'Not Running',
    appUrl: ''
  };

  loading = false;
  successMessage = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Application Submitted:', this.application);
      this.successMessage = 'Application added successfully! (Simulation)';
      this.loading = false;
      
      // Reset form after success
      setTimeout(() => {
        this.successMessage = '';
        // Optional: Navigate back or clear form
        // this.router.navigate(['/admin/application-manager']);
      }, 3000);
    }, 1000);
  }

  cancel() {
    this.router.navigate(['/admin/application-manager']);
  }
}
