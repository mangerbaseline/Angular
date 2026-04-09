import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackgroundAnimationComponent } from './components/background-animation/background-animation.component';
import { BrandHeaderComponent } from './components/brand-header/brand-header.component';

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
      display: flex;
      justify-content: space-between;
      padding: 40px 80px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.3);
      font-weight: 500;
      z-index: 5;
      margin-top: auto;
    }

    .gf-left {
      max-width: 300px;
      line-height: 1.5;
    }

    .gf-right {
      text-align: right;
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
export class App {
  title = 'angularpaymentui';
}
