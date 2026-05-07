import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="position: absolute; top: 0; left: 0; width: 100%; min-height: 100%; z-index: -999; pointer-events: none; overflow: visible; background-color: #020617;">
      <!-- Nebula Dust (Subtle base gradient) -->
      <div class="absolute inset-0 opacity-40" 
        style="background: radial-gradient(circle at 30% 50%, rgba(16, 185, 127, 0.08) 0%, transparent 60%);">
      </div>

      <!-- Floating Galaxy Particles (Stars) -->
      <div 
        *ngFor="let p of particles" 
        class="star-particle absolute rounded-full bg-primary" 
        [style.left.%]="p.x" 
        [style.top.%]="p.y" 
        [style.width.px]="p.size" 
        [style.height.px]="p.size" 
        [style.opacity]="p.opacity" 
        [style.animation-delay]="p.delay + 's'"
        [style.animation-duration]="p.duration + 's'">
      </div>

      <!-- Main Central Core (Behind the visual components) -->
      <div class="galaxy-core absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2">
        <div class="w-[45rem] h-[45rem] rounded-full" 
          style="background: radial-gradient(circle, rgba(16, 185, 127, 0.15) 0%, transparent 70%); transform: scale(1.1); animation: corePulse 12s ease-in-out infinite alternate;">
        </div>
      </div>

      <!-- Orbiting Rings/Galaxy Dots -->
      <div class="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2">
        <!-- Static offset wrapper so they don't start in a straight line -->
        <div *ngFor="let o of orbits" 
          class="absolute" 
          style="left: 50%; top: 50%;"
          [style.transform]="'rotate(' + o.angle + 'deg)'">
          <!-- Animated rotating wrapper -->
          <div class="absolute rounded-full orbit-ring" 
            [style.width.px]="o.size" 
            [style.height.px]="o.size" 
            style="left: 0; top: 0;"
            [style.animation-duration]="o.speed + 's'"
            [style.animation-delay]="o.delay + 's'">
            <!-- The actual glowing dot -->
            <div class="absolute rounded-full bg-primary shadow-glow" 
              [style.width.px]="o.size" 
              [style.height.px]="o.size" 
              [style.left.px]="o.radius"
              style="top: 50%; transform: translateY(-50%);"
              [style.box-shadow]="'0 0 ' + (o.size * 4) + 'px var(--primary)'">
            </div>
          </div>
        </div>
      </div>

      <!-- PREMIUM TURBINE OBJECTS (Now integrated into background component) -->
      <div class="diamond-turbine">
        <div class="spin-layer">
          <div class="breathe-layer"></div>
        </div>
      </div>

      <div class="blob-turbine">
        <div class="spin-layer">
          <div class="breathe-layer"></div>
        </div>
      </div>

      <!-- Bonus drifting subtle particles -->
      <div class="bonus-particle"><div></div></div>
      <div class="bonus-particle-2"><div></div></div>
    </div>
  `,
  styleUrls: ['./background-animation.component.css']
})
export class BackgroundAnimationComponent {
  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.8 + Math.random() * 2,
    opacity: 0.1 + Math.random() * 0.3,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 15
  }));

  orbits = [
    { size: 1.5, radius: 90, speed: 25, delay: -2, angle: 45 },
    { size: 2.2, radius: 130, speed: 30, delay: -5, angle: 120 },
    { size: 3.5, radius: 170, speed: 35, delay: -8, angle: 210 },
    { size: 1.8, radius: 210, speed: 40, delay: -12, angle: 300 },
    { size: 2.8, radius: 250, speed: 45, delay: -15, angle: 15 },
    { size: 4.5, radius: 290, speed: 52, delay: -20, angle: 85 },
    { size: 5.2, radius: 330, speed: 58, delay: -25, angle: 165 },
    { size: 3.8, radius: 370, speed: 65, delay: -30, angle: 255 },
    { size: 2.1, radius: 410, speed: 72, delay: -35, angle: 330 },
    { size: 4.8, radius: 450, speed: 80, delay: -40, angle: 60 },
  ];
}
