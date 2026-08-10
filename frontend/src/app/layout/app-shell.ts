import { Component } from '@angular/core';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [Header, Sidebar, RouterOutlet, CommonModule],
  template: `
    <div class="min-h-screen relative z-10 flex flex-col" style="background:transparent;">

      <!-- ══ HEADER (passes hamburger toggle) ══ -->
      <app-header (menuToggle)="toggleSidebar()"></app-header>

      <!-- ══ BODY ROW ══ -->
      <div class="flex flex-row gap-5 flex-grow px-3 md:px-6 pb-2 pt-2">

        <!-- Desktop Sidebar (always visible ≥768px) -->
        <div class="hidden md:block flex-shrink-0">
          <app-sidebar [isOpen]="true"></app-sidebar>
        </div>

        <!-- Mobile Sidebar Drawer -->
        <div class="md:hidden">
          <app-sidebar [isOpen]="drawerOpen" (closeDrawer)="closeSidebar()"></app-sidebar>
        </div>

        <!-- Mobile Backdrop -->
        <div *ngIf="drawerOpen"
             class="mobile-backdrop md:hidden"
             (click)="closeSidebar()"
             aria-hidden="true"></div>

        <!-- Main content -->
        <main class="flex-grow overflow-x-hidden main-content"
              style="min-width:0;">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- ═══════════════ PREMIUM FOOTER ═══════════════ -->
      <footer class="footer-bar mx-3 md:mx-6 mb-4 mt-2 relative z-10 overflow-hidden rounded-2xl">

        <!-- Animated RGB top bar -->
        <div class="footer-rgb-bar"></div>

        <!-- Floating star particles -->
        <div class="footer-stars" aria-hidden="true">
          <span class="fstar fs1">✦</span><span class="fstar fs2">◆</span>
          <span class="fstar fs3">✦</span><span class="fstar fs4">★</span>
          <span class="fstar fs5">✦</span><span class="fstar fs6">◇</span>
          <span class="fstar fs7">✦</span>
        </div>

        <!-- Footer content -->
        <div class="footer-content px-4 md:px-6 py-4 flex flex-col sm:flex-row
                    items-center justify-between gap-3 relative z-10">

          <!-- LEFT: Brand -->
          <div class="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <div class="footer-dot-live"></div>
            <div class="flex flex-col leading-none gap-0.5">
              <span class="text-sm font-black tracking-[0.08em]"
                    style="color:rgba(220,235,248,0.9);">Spring Java Mastery</span>
              <span class="text-[10px] font-semibold tracking-widest uppercase"
                    style="color:rgba(0,212,255,0.5);">Deep Learning Platform</span>
            </div>
            <div class="footer-pipe hidden sm:block">|</div>
            <div class="footer-tech-badges hidden sm:flex">
              <span class="tech-badge" style="color:rgb(0,212,255);border-color:rgba(0,212,255,0.25);">Spring</span>
              <span class="tech-badge" style="color:rgb(0,255,157);border-color:rgba(0,255,157,0.25);">Java</span>
              <span class="tech-badge" style="color:rgb(255,107,53);border-color:rgba(255,107,53,0.25);">SQL</span>
            </div>
          </div>

          <!-- CENTER: Authorized -->
          <div class="flex flex-col items-center gap-1.5">
            <div class="footer-authorized-badge">
              <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                   stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
              </svg>
              <span>✦ AUTHORIZED &amp; CERTIFIED ✦</span>
            </div>
            <div class="footer-bottom-line"></div>
          </div>

          <!-- RIGHT: Author -->
          <div class="flex items-center gap-3">
            <div class="footer-at-ring">@</div>
            <div class="flex flex-col items-start leading-none gap-1">
              <span class="footer-author-name">Md Sadique Amin</span>
              <span class="text-[10px] font-semibold"
                    style="color:rgba(0,212,255,0.45);">
                © {{ currentYear }} · All Rights Reserved
              </span>
            </div>
          </div>
        </div>

        <div class="footer-bottom-rgb"></div>
      </footer>
    </div>
  `,
  styles: [`
    /* ── Page enter animation ── */
    .main-content {
      animation: pageEnter 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
    }
    @keyframes pageEnter {
      from { opacity:0; transform: translateY(20px) scale(0.98); }
      to   { opacity:1; transform: translateY(0) scale(1); }
    }

    /* ── Mobile backdrop ── */
    .mobile-backdrop {
      position: fixed; inset: 0; z-index: 199;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(4px);
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

    /* ══ FOOTER ══ */
    .footer-bar {
      background: rgba(4,8,22,0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(0,212,255,0.15);
      animation: footer-border-cycle 10s linear infinite;
    }
    @keyframes footer-border-cycle {
      0%   { border-color: rgba(0,212,255,0.18); }
      20%  { border-color: rgba(0,255,157,0.15); }
      40%  { border-color: rgba(255,107,53,0.18); }
      60%  { border-color: rgba(220,38,38,0.15); }
      80%  { border-color: rgba(160,82,45,0.15); }
      100% { border-color: rgba(0,212,255,0.18); }
    }

    .footer-rgb-bar {
      height: 2px; width: 100%;
      background: linear-gradient(90deg,
        transparent 0%, rgb(0,212,255) 15%, rgb(0,255,157) 30%,
        rgb(255,107,53) 50%, rgb(220,38,38) 70%, rgb(160,82,45) 85%, transparent 100%);
      background-size: 200% 100%;
      animation: rgb-bar-flow 3s linear infinite;
    }
    @keyframes rgb-bar-flow { 0% { background-position:0%; } 100% { background-position:200%; } }

    .footer-bottom-rgb {
      height: 1px;
      background: linear-gradient(90deg,
        transparent, rgba(220,38,38,0.4), rgba(160,82,45,0.4),
        rgba(255,107,53,0.4), transparent);
      background-size: 200% 100%;
      animation: rgb-bar-flow 4s linear infinite reverse;
    }

    /* Stars */
    .footer-stars { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
    .fstar { position:absolute; font-size:0.5rem; animation:fstar-rise 6s ease-in-out infinite; opacity:0; }
    .fs1 { left:5%;  bottom:0; color:rgb(0,212,255);  animation-delay:0s;   animation-duration:5s; }
    .fs2 { left:15%; bottom:0; color:rgb(0,255,157);  animation-delay:0.7s; animation-duration:6s; }
    .fs3 { left:30%; bottom:0; color:rgb(255,107,53); animation-delay:1.4s; animation-duration:4.5s; }
    .fs4 { left:50%; bottom:0; color:rgb(220,38,38);  animation-delay:2.1s; animation-duration:5.5s; }
    .fs5 { left:65%; bottom:0; color:rgb(160,82,45);  animation-delay:2.8s; animation-duration:6.5s; }
    .fs6 { left:80%; bottom:0; color:rgb(0,212,255);  animation-delay:3.5s; animation-duration:5s; }
    .fs7 { left:92%; bottom:0; color:rgb(0,255,157);  animation-delay:4.2s; animation-duration:4s; }
    @keyframes fstar-rise {
      0%   { transform:translateY(0) scale(0.5) rotate(0deg); opacity:0; }
      30%  { opacity:0.8; }
      100% { transform:translateY(-50px) scale(1) rotate(360deg); opacity:0; }
    }

    .footer-content {
      background: linear-gradient(135deg,
        rgba(0,212,255,0.03) 0%, transparent 40%,
        rgba(220,38,38,0.03) 80%, rgba(160,82,45,0.02) 100%);
    }

    .footer-dot-live {
      width:9px; height:9px; border-radius:50%;
      background:rgb(0,212,255);
      box-shadow:0 0 10px rgba(0,212,255,0.9);
      animation:dot-live 2s ease-in-out infinite; flex-shrink:0;
    }
    @keyframes dot-live {
      0%,100% { transform:scale(1);   box-shadow:0 0 6px rgba(0,212,255,0.7); }
      50%      { transform:scale(1.4); box-shadow:0 0 18px rgba(0,212,255,0.95); }
    }

    .footer-pipe { color:rgba(0,212,255,0.15); font-size:1rem; }
    .footer-tech-badges { display:flex; gap:5px; }
    .tech-badge {
      font-size:0.6rem; font-weight:700; letter-spacing:0.08em;
      text-transform:uppercase; padding:2px 7px; border-radius:999px; border:1px solid;
    }

    .footer-authorized-badge {
      display:flex; align-items:center; gap:6px;
      padding:4px 14px; border-radius:999px;
      border:1px solid rgba(0,255,157,0.3);
      background:rgba(0,255,157,0.07);
      color:rgb(0,255,157); font-size:0.65rem; font-weight:800; letter-spacing:0.1em;
      animation:auth-glow 3s ease-in-out infinite;
      white-space:nowrap;
    }
    @keyframes auth-glow {
      0%,100% { box-shadow:0 0 8px rgba(0,255,157,0.15); }
      50%      { box-shadow:0 0 28px rgba(0,255,157,0.4),0 0 50px rgba(0,255,157,0.1); }
    }
    .footer-bottom-line {
      height:1px; width:50px; border-radius:999px;
      background:linear-gradient(90deg,transparent,rgba(0,255,157,0.4),transparent);
    }

    .footer-at-ring {
      width:34px; height:34px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      font-weight:900; font-size:0.95rem;
      background:rgba(0,212,255,0.1); border:1.5px solid rgba(0,212,255,0.35);
      color:rgb(0,212,255); flex-shrink:0;
      animation:at-glow-rotate 6s ease-in-out infinite;
    }
    @keyframes at-glow-rotate {
      0%,100% { box-shadow:0 0 10px rgba(0,212,255,0.3);  border-color:rgba(0,212,255,0.35);  transform:rotate(0deg); }
      25%      { box-shadow:0 0 18px rgba(0,255,157,0.4);  border-color:rgba(0,255,157,0.4);   transform:rotate(10deg); }
      50%      { box-shadow:0 0 22px rgba(255,107,53,0.4); border-color:rgba(255,107,53,0.4);  transform:rotate(0deg); }
      75%      { box-shadow:0 0 18px rgba(220,38,38,0.4);  border-color:rgba(220,38,38,0.35);  transform:rotate(-10deg); }
    }

    .footer-author-name {
      font-size:0.82rem; font-weight:900; letter-spacing:0.05em;
      background:linear-gradient(90deg,
        rgb(0,212,255), rgb(0,255,157), rgb(255,107,53), rgb(220,38,38), rgb(0,212,255));
      background-size:300% 100%;
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
      animation:name-flow 5s linear infinite;
    }
    @keyframes name-flow { 0% { background-position:0%; } 100% { background-position:200%; } }
  `]
})
export class AppShell {
  currentYear = new Date().getFullYear();
  drawerOpen = false;

  toggleSidebar() { this.drawerOpen = !this.drawerOpen; }
  closeSidebar()  { this.drawerOpen = false; }
}
