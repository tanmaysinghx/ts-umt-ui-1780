import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  darkMode: boolean = localStorage.getItem('theme') === 'dark';

  loading = false;
  errorMessage: string | null = null;

  avatarUrl =
    'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

  profile = {
    fullName: 'Your Name',
    email: 'you@example.com',
    jobTitle: 'Role / Title',
    department: 'Team / BU',
    location: 'City, Country',
    phone: '+91-XXXXXXXXXX',
    timezone: 'Asia/Kolkata',
    pronouns: '',
    about: '',
    skills: 'Angular, Node.js, TypeScript',
  };

  ngOnInit(): void {
    document.documentElement.classList.toggle('dark', this.darkMode);
    // later: load profile from backend
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  refreshProfile(): void {
    this.loading = true;
    this.errorMessage = null;
    // TODO: call API and hydrate profile
    setTimeout(() => {
      this.loading = false;
    }, 800);
  }

  saveProfile(): void {
    this.loading = true;
    this.errorMessage = null;

    const payload = { ...this.profile };
    console.log('Profile payload', payload);

    // TODO: call API
    setTimeout(() => {
      this.loading = false;
    }, 800);
  }

  resetProfile(): void {
    // In real app, reload from server baseline
    this.profile = {
      fullName: 'Your Name',
      email: 'you@example.com',
      jobTitle: 'Role / Title',
      department: 'Team / BU',
      location: 'City, Country',
      phone: '+91-XXXXXXXXXX',
      timezone: 'Asia/Kolkata',
      pronouns: '',
      about: '',
      skills: 'Angular, Node.js, TypeScript',
    };
  }

  changeAvatar(): void {
    // hook UI / file upload later
    console.log('Change avatar clicked');
  }
}
