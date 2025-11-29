import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'Live' | 'Coming Soon';
  icon: string;
  features: string[];
  techStack: { name: string; icon: string }[];
  screenshots: string[];
}

@Component({
  selector: 'app-product-screen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-screen.component.html',
  styleUrl: './product-screen.component.scss'
})
export class ProductScreenComponent {
  currentYear = new Date().getFullYear();

  products: Product[] = [
    {
      id: 'sso-portal',
      name: 'SSO Portal',
      tagline: 'Unified Access Control',
      description: 'A centralized Single Sign-On (SSO) solution designed to streamline user authentication across your entire enterprise ecosystem. Enhance security with MFA and simplify the login experience.',
      status: 'Live',
      icon: 'lock-closed',
      features: [
        'Multi-Factor Authentication (MFA)',
        'Role-Based Access Control (RBAC)',
        'Seamless Integration with OAuth2 & SAML',
        'Real-time Security Audits',
        'User Session Management'
      ],
      techStack: [
        { name: 'Angular', icon: 'https://angular.io/assets/images/logos/angular/angular.svg' },
        { name: 'Spring Boot', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Spring_Framework_Logo_2018.svg' },
        { name: 'Redis', icon: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Redis_Logo.svg' }
      ],
      screenshots: [
        'https://placehold.co/800x500/1e1b4b/FFF?text=SSO+Dashboard+Overview',
        'https://placehold.co/800x500/1e1b4b/FFF?text=Login+Screen+with+MFA',
        'https://placehold.co/800x500/1e1b4b/FFF?text=User+Management+Panel'
      ]
    },
    {
      id: 'ticketing-tool',
      name: 'Ticketing Tool',
      tagline: 'Enterprise Support System',
      description: 'An intelligent ticketing system that automates support workflows. Prioritize issues, assign tasks automatically, and track resolution times with advanced analytics.',
      status: 'Coming Soon',
      icon: 'ticket',
      features: [
        'Automated Ticket Routing',
        'SLA Tracking & Alerts',
        'Email & Slack Integration',
        'Knowledge Base Integration',
        'Customer Satisfaction Surveys'
      ],
      techStack: [
        { name: 'React', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
        { name: 'Node.js', icon: 'https://nodejs.org/static/images/logo.svg' },
        { name: 'MongoDB', icon: 'https://upload.wikimedia.org/wikipedia/en/4/45/MongoDB-Logo.svg' }
      ],
      screenshots: [
        'https://placehold.co/800x500/1e1b4b/FFF?text=Ticket+Kanban+Board',
        'https://placehold.co/800x500/1e1b4b/FFF?text=Ticket+Detail+View',
        'https://placehold.co/800x500/1e1b4b/FFF?text=Analytics+Dashboard'
      ]
    },
    {
      id: 'kanban-board',
      name: 'Kanban Board',
      tagline: 'Agile Project Management',
      description: 'Visualize your workflow with our intuitive Kanban board. Drag-and-drop tasks, collaborate in real-time, and keep your team aligned on project goals.',
      status: 'Live',
      icon: 'view-boards',
      features: [
        'Drag-and-Drop Interface',
        'Real-time Collaboration',
        'Customizable Workflows',
        'Task Dependencies',
        'Burn-down Charts'
      ],
      techStack: [
        { name: 'Vue.js', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg' },
        { name: 'Firebase', icon: 'https://firebase.google.com/static/images/brand-guidelines/logo-logomark.png' }
      ],
      screenshots: [
        'https://placehold.co/800x500/1e1b4b/FFF?text=Project+Board+View',
        'https://placehold.co/800x500/1e1b4b/FFF?text=Task+Edit+Modal',
        'https://placehold.co/800x500/1e1b4b/FFF?text=Team+Activity+Feed'
      ]
    },
    {
      id: 'crm-suite',
      name: 'CRM Suite',
      tagline: 'Customer Relationship Management',
      description: 'A comprehensive CRM solution to manage customer interactions, track sales pipelines, and drive growth. optimized for mobile and desktop use.',
      status: 'Coming Soon',
      icon: 'users',
      features: [
        'Contact Management',
        'Sales Pipeline Visualization',
        'Email Marketing Automation',
        'Mobile App Support',
        'Integration with Outlook & Gmail'
      ],
      techStack: [
        { name: 'React Native', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
        { name: 'GraphQL', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg' },
        { name: 'PostgreSQL', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg' }
      ],
      screenshots: [
        'https://placehold.co/300x600/1e1b4b/FFF?text=Mobile+App+Home',
        'https://placehold.co/300x600/1e1b4b/FFF?text=Contact+Profile',
        'https://placehold.co/800x500/1e1b4b/FFF?text=Desktop+Dashboard'
      ]
    }
  ];
}
