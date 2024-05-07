import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-breadcrump',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrump.component.html',
  styleUrl: './breadcrump.component.scss'
})
export class BreadcrumpComponent {

  currentPathValue: any;
  pathArray: any = [];
  activePathValue: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getPathValue();
  }

  /* Function gets active path value from url and processes it */
  getPathValue() {
    const currentPath = window.location.pathname;
    this.currentPathValue = currentPath;
    let temp = this.currentPathValue.split('/');
    for (let i = 0; i < temp.length; i++) {
      if (i != 0 && i != temp.length - 1) {
        let path = this.capitalizeEachWord(temp[i]);
        this.pathArray.push(path);
      } else if (i == temp.length - 1) {
        let path = this.capitalizeEachWord(temp[i]);
        this.activePathValue = path;
      }
    }
  }

  /* Function to captilize each letter of word */
  capitalizeEachWord(str: string): string {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  }

}
