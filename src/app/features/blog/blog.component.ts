import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  image: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  isLoading = true;

  // Data States
  allPosts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];

  // Filter States
  searchQuery: string = '';
  selectedCategory: string = 'All';
  categories: string[] = ['All'];

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {
    this.http.get<BlogPost[]>('assets/data/blog-data.json').subscribe({
      next: (data) => {
        // 1. Sort by Latest First (Descending Date)
        this.allPosts = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // 2. Extract Unique Categories dynamically
        const uniqueCats = [...new Set(this.allPosts.map((p) => p.category))];
        this.categories = ['All', ...uniqueCats];

        // 3. Initialize View
        this.filteredPosts = this.allPosts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  // Core Filter Logic
  applyFilters() {
    this.filteredPosts = this.allPosts.filter((post) => {
      // Check Category
      const matchesCategory =
        this.selectedCategory === 'All' ||
        post.category === this.selectedCategory;

      // Check Search (Title or Excerpt)
      const query = this.searchQuery.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }

  // Event Handlers
  onSearchChange() {
    this.applyFilters();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }
}