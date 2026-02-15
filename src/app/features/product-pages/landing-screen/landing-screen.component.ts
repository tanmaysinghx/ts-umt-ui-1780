import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-screen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-screen.component.html',
  styleUrl: './landing-screen.component.scss',
})
export class LandingScreenComponent implements OnInit {
  currentYear = new Date().getFullYear();
  isMobileMenuOpen = false;
  darkMode = false;
  revealElements: Element[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      this.darkMode = savedTheme === 'dark' || (!savedTheme && systemDark);
      this.applyTheme();

      // Initialize Scroll Observer
      this.setupScrollObserver();
    }
  }

  setupScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }, 100);
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  onMouseMove(event: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  services = [
    {
      name: 'Generative AI',
      icon: 'assets/icons/ai-brain.svg', // Placeholder, we will use inline SVGs or existing assets if available, but for now names matter most
      desc: 'LLMs & Agents',
    },
    {
      name: 'Data Analytics',
      icon: 'assets/icons/analytics.svg',
      desc: 'Predictive Insights',
    },
    {
      name: 'Cloud Native',
      icon: 'assets/icons/cloud.svg',
      desc: 'Scalable Infra',
    },
    {
      name: 'Cyber Security',
      icon: 'assets/icons/shield.svg',
      desc: 'Zero Trust',
    }
  ];

  serviceOfferings = [
    {
      title: 'AI Engineering',
      desc: 'Custom LLM training, RAG pipelines, and autonomous agent systems designed for enterprise scale.',
      icon: 'chip',
    },
    {
      title: 'Data Intelligence',
      desc: 'Transform raw data into actionable insights with advanced warehousing and predictive modeling.',
      icon: 'cloud',
    },
    {
      title: 'Cloud Architecture',
      desc: 'Resilient, auto-scaling infrastructure built on AWS, Azure, and Google Cloud Platform.',
      icon: 'code',
    },
    {
      title: 'Enterprise Platforms',
      desc: 'Modernizing legacy systems into distributed, microservices-based architectures.',
      icon: 'device-mobile',
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
