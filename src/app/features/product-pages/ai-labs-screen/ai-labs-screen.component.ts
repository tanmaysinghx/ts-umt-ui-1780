import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ai-labs-screen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ai-labs-screen.component.html',
  styleUrl: './ai-labs-screen.component.scss'
})
export class AiLabsScreenComponent {
  
  experiments = [
    {
      title: 'Neural Voice Synthesis',
      description: 'Real-time text-to-speech generation with emotional context awareness.',
      status: 'Beta',
      tags: ['Audio', 'GenAI', 'Real-time'],
      icon: 'microphone',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      title: 'Predictive Code Assistant',
      description: 'Context-aware code completion trained on internal enterprise repositories.',
      status: 'Alpha',
      tags: ['DevTools', 'LLM', 'Productivity'],
      icon: 'code',
      color: 'text-fuchsia-400',
      bg: 'bg-fuchsia-500/10',
      border: 'border-fuchsia-500/20'
    },
    {
      title: 'Autonomous Security Agent',
      description: 'Self-learning agent that detects and neutralizes zero-day threats.',
      status: 'Prototype',
      tags: ['Security', 'Reinforcement Learning'],
      icon: 'shield-check',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Vision-Language Model V2',
      description: 'Multimodal model capable of understanding complex industrial diagrams.',
      status: 'Training',
      tags: ['Computer Vision', 'Multimodal'],
      icon: 'eye',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20'
    }
  ];

  metrics = [
    { label: 'Active Models', value: '12', unit: '', change: '+2' },
    { label: 'Daily Inferences', value: '1.2M', unit: '', change: '+15%' },
    { label: 'Avg. Latency', value: '45', unit: 'ms', change: '-12%' },
    { label: 'Training Hours', value: '8.5k', unit: 'hrs', change: '+500' }
  ];

}
