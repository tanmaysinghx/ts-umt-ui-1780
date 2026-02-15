import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ai-labs-screen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ai-labs-screen.component.html',
  styleUrl: './ai-labs-screen.component.scss'
})
export class AiLabsScreenComponent implements OnInit {
  darkMode = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      this.darkMode = savedTheme === 'dark' || (!savedTheme && systemDark);
      this.applyTheme();
    }
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

  experiments = [
    {
      title: 'Enterprise RAG Pipeline',
      description: 'Hybrid vector search with semantic re-ranking for million-scale document retrieval.',
      status: 'Production',
      tags: ['Vector DB', 'Semantic Search', 'LangChain'],
      icon: 'database',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      title: 'Neural Rendering Engine',
      description: 'Real-time NeRF generation for photorealistic digital twin visualization.',
      status: 'Beta',
      tags: ['NeRF', 'WebGL', '3D Vision'],
      icon: 'cube',
      color: 'text-fuchsia-400',
      bg: 'bg-fuchsia-500/10',
      border: 'border-fuchsia-500/20'
    },
    {
      title: 'Autonomous Agents Swarm',
      description: 'Multi-agent orchestration system for complex workflow automation and reasoning.',
      status: 'Alpha',
      tags: ['AutoGPT', 'Orchestration', 'Reasoning'],
      icon: 'cpu',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Multimodal transformer V4',
      description: 'Unified architecture processing text, image, and tabular data simultaneously.',
      status: 'Training',
      tags: ['Transformer', 'Multimodal', 'PyTorch'],
      icon: 'eye',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20'
    }
  ];

  metrics = [
    { label: 'Active LLMs', value: '42', unit: 'Models', change: '+5' },
    { label: 'Token Throughput', value: '8.4B', unit: 'Tok/day', change: '+124%' },
    { label: 'Avg. Latency', value: '12', unit: 'ms', change: '-40%' },
    { label: 'Vector Index', value: '1.2T', unit: 'Vectors', change: '+15%' }
  ];

}
