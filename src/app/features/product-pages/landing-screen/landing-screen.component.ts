import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-screen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-screen.component.html',
  styleUrl: './landing-screen.component.scss',
})
export class LandingScreenComponent {
  currentYear = new Date().getFullYear();
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  services = [
    {
      name: 'Angular',
      icon: 'https://angular.io/assets/images/logos/angular/angular.svg',
      desc: 'Modern Web Apps',
    },
    {
      name: 'React',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      desc: 'Dynamic Interfaces',
    },
    {
      name: 'Java',
      icon: 'https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg',
      desc: 'Enterprise Backend',
    },
    {
      name: 'Spring Boot',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Spring_Framework_Logo_2018.svg',
      desc: 'Microservices',
    },
    {
      name: 'Node.js',
      icon: 'https://nodejs.org/static/images/logo.svg',
      desc: 'Scalable APIs',
    },
    {
      name: 'React Native',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      desc: 'Cross-Platform Mobile',
    },
    {
      name: 'Generative AI',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      desc: 'LLM Integration',
    },
    {
      name: 'Kafka',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Apache_Kafka_logo.svg',
      desc: 'Event Streaming',
    },
    {
      name: 'Redis',
      icon: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Redis_Logo.svg',
      desc: 'High Performance Caching',
    },
  ];

  serviceOfferings = [
    {
      title: 'Fullstack Development',
      desc: 'End-to-end web application development using modern frameworks like Angular, React, and Node.js.',
      icon: 'code',
    },
    {
      title: 'Mobile App Development',
      desc: 'Native and cross-platform mobile solutions using React Native for iOS and Android.',
      icon: 'device-mobile',
    },
    {
      title: 'AI & Machine Learning',
      desc: 'Intelligent solutions including LLM integration, predictive analytics, and process automation.',
      icon: 'chip',
    },
    {
      title: 'Cloud Infrastructure',
      desc: 'Scalable and secure cloud architecture design and management on AWS, Azure, and GCP.',
      icon: 'cloud',
    },
  ];

  products = [
    {
      name: 'SSO Portal',
      status: 'Live',
      desc: 'Unified Access Control',
      icon: 'lock-closed',
      screenshots: [
        'https://placehold.co/600x400/1e1b4b/FFF?text=SSO+Dashboard',
        'https://placehold.co/600x400/1e1b4b/FFF?text=Login+Screen',
      ],
      isMobile: false,
    },
    {
      name: 'Ticketing Tool',
      status: 'Coming Soon',
      desc: 'Enterprise Support System',
      icon: 'ticket',
      screenshots: [
        'https://placehold.co/600x400/1e1b4b/FFF?text=Ticket+Board',
        'https://placehold.co/600x400/1e1b4b/FFF?text=Ticket+Details',
      ],
      isMobile: false,
    },
    {
      name: 'Kanban Board',
      status: 'Live',
      desc: 'Agile Project Management',
      icon: 'view-boards',
      screenshots: [
        'https://placehold.co/600x400/1e1b4b/FFF?text=Kanban+View',
        'https://placehold.co/600x400/1e1b4b/FFF?text=Task+Modal',
      ],
      isMobile: false,
    },
    {
      name: 'CRM Suite',
      status: 'Coming Soon',
      desc: 'Customer Relationship Management',
      icon: 'users',
      screenshots: [
        'https://placehold.co/300x600/1e1b4b/FFF?text=Mobile+CRM',
        'https://placehold.co/300x600/1e1b4b/FFF?text=Contact+List',
      ],
      isMobile: true,
    },
  ];

  companies = [
    {
      name: 'Acme Corp',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
    },
    {
      name: 'Global Tech',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png',
    },
    {
      name: 'Innovate Inc',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png',
    },
    {
      name: 'Future Systems',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png',
    },
    {
      name: 'Alpha Group',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png',
    },
  ];

  testimonials = [
    {
      name: 'John Doe',
      role: 'CTO, TechFlow',
      content:
        'TS Group transformed our legacy systems into a modern, scalable architecture. Their expertise in Angular and Spring Boot is unmatched.',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
  ];
}
