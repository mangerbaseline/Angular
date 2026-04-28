import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { BackgroundAnimationComponent } from './components/background-animation/background-animation.component';
import { BrandHeaderComponent } from './components/brand-header/brand-header.component';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BackgroundAnimationComponent,
    BrandHeaderComponent
  ],
  templateUrl: './app.html',
  styles: [`
    .app-container {
      width: 100vw;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      color: #fff;
      font-family: 'Inter', sans-serif;
      position: relative;
    }

    .global-footer {
      width: 100%;
      max-width: 80rem;
      margin-inline: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.4);
      font-weight: 500;
      padding: 0 0 40px 0;
      z-index: 5;
      margin-top: auto; /* pull up if needed, or adjust */
    }

    .gf-left {
      flex: 1;
      text-align: center;
      line-height: 1.6;
      padding: 0 140px 0 40px;
    }

    .gf-right { 
      flex: 1;
      padding: 20px 40px 0 140px;
      font-size: 12px;
      text-align: center;
    }
    .footer-border{
        display: flex;
        width: 50%;
        margin-left: auto;
        border-top :  1px solid rgba(255, 255, 255, 0.08);
    }

    .gf-right strong {
      color: #475569;
    }

    @media (max-width: 1300px) {
      .global-footer { padding: 40px 40px; }
    }

    @media (max-width: 1100px) {
      .global-footer {
        flex-direction: column;
        align-items: center;
        gap: 12px;
        text-align: center;
      }
    }
  `],
})
export class App implements OnInit {
  title = 'angularpaymentui';
  showHeaderFooter = true;
  toastService = inject(ToastService);

  constructor(private router: Router) {}

  ngOnInit() {
    // Initial check for current URL
    this.showHeaderFooter = !this.router.url.includes('/success');

    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showHeaderFooter = !event.urlAfterRedirects.includes('/success');
    });
  }
}
