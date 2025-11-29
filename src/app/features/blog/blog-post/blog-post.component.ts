import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'image'; url: string; caption?: string };

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  content: ContentBlock[];
  image: string;
  linkedin?: string;
  role?: string;
  newCommentText: string;
}

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  date: string;
  text: string;
}

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './blog-post.component.html',
})
export class BlogPostComponent implements OnInit {
  post: BlogPost | null = null;
  isLoading = true;
  newCommentText: any;

  constructor(private readonly route: ActivatedRoute, private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.fetchPost(id);
      } else {
        this.isLoading = false;
      }
    });
  }

  fetchPost(id: number): void {
    this.isLoading = true;
    this.http.get<BlogPost[]>('assets/data/blog-data.json').subscribe({
      next: (posts) => {
        this.post = posts.find((p) => p.id === id) || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching blog post:', error);
        this.isLoading = false;
      },
    });
  }

  asParagraph(block: ContentBlock): { type: 'paragraph'; text: string } {
    return block as any;
  }

  asHeading(block: ContentBlock): { type: 'heading'; text: string } {
    return block as any;
  }

  asCode(block: ContentBlock): {
    type: 'code';
    language: string;
    code: string;
  } {
    return block as any;
  }

  asImage(block: ContentBlock): {
    type: 'image';
    url: string;
    caption?: string;
  } {
    return block as any;
  }

  copiedBlockIndex: number | null = null;

  copyCode(code: string, index: number): void {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        this.copiedBlockIndex = index;
        setTimeout(() => {
          this.copiedBlockIndex = null;
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  }

  comments: Comment[] = [
    { id: 1, user: 'Dev_J', avatar: 'DJ', date: '2 hours ago', text: 'This is exactly what I needed for my next interview. The Signals section is gold.' },
    { id: 2, user: 'Sarah.Ts', avatar: 'ST', date: '5 hours ago', text: 'Could you explain the difference between mergeMap and switchMap with a visual diagram in the next post?' }
  ];

  sharePost(): void {
    const url = window.location.href;
    const title = this.post?.title || 'Check out this article';

    if (navigator.share) {
      navigator.share({
        title: title,
        url: url
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!'); // Replace with a custom toast notification if you have one
      });
    }
  }

  submitComment(): void {
    if (!this.newCommentText.trim()) return;

    const newComment: Comment = {
      id: this.comments.length + 1,
      user: 'Guest_User',
      avatar: 'GU',
      date: 'Just now',
      text: this.newCommentText
    };

    this.comments.unshift(newComment);
    this.newCommentText = '';
  }
}
