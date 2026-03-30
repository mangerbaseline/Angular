import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-root">
      <!-- Radial gradient layers -->
      <div class="gradient-layer gl1"></div>
      <div class="gradient-layer gl2"></div>
      <div class="gradient-layer gl3"></div>
      <!-- Noise/grain texture overlay -->
      <div class="grain"></div>
      <!-- Star field -->
      <div class="star-field">
        <div
          *ngFor="let s of stars"
          class="star"
          [style.left.%]="s.x"
          [style.top.%]="s.y"
          [style.width.px]="s.size"
          [style.height.px]="s.size"
          [style.animation-delay.s]="s.delay"
          [style.animation-duration.s]="s.dur">
        </div>
      </div>
      <!-- Floating orbs -->
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>
    </div>
  `,
  styles: []
})
export class BackgroundAnimationComponent {
  stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.5 + Math.random() * 1.5,
    delay: Math.random() * 8,
    dur: 3 + Math.random() * 6,
  }));
}
