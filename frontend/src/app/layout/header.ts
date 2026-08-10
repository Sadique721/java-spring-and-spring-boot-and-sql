import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, TopicResponse } from '../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HinglishService } from '../core/services/hinglish.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="header-scanline mx-3 md:mx-6 mt-3 mb-2 px-4 md:px-5 py-3
                   flex items-center justify-between sticky top-3 z-50 header-main">

      <!-- Sparkle particles -->
      <div class="header-particles" aria-hidden="true">
        <span class="hsp hsp-1">✦</span><span class="hsp hsp-2">◆</span>
        <span class="hsp hsp-3">✦</span><span class="hsp hsp-4">⬡</span>
        <span class="hsp hsp-5">✦</span>
      </div>

      <!-- ══ LEFT: Hamburger (mobile) + Logo ══ -->
      <div class="flex items-center gap-3 relative z-10">

        <!-- Hamburger button (mobile only) -->
        <button class="hamburger-btn md:hidden"
                (click)="menuToggle.emit()"
                aria-label="Open menu">
          <span class="ham-line"></span>
          <span class="ham-line ham-line-mid"></span>
          <span class="ham-line"></span>
        </button>

        <!-- Logo -->
        <div class="logo-wrap">
          <svg viewBox="0 0 44 44" fill="none" class="w-6 h-6 animate-float"
               style="position:relative;z-index:2;">
            <circle cx="22" cy="22" r="18" stroke="url(#hG2)" stroke-width="2.5" opacity="0.8"/>
            <circle cx="22" cy="22" r="7"  fill="url(#hG2)" opacity="0.7"/>
            <path d="M15 22 L20 27 L29 17" stroke="rgb(4,7,18)" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="hG2" x1="0" y1="0" x2="44" y2="44">
                <stop offset="0%"   stop-color="rgb(0,255,157)"/>
                <stop offset="40%"  stop-color="rgb(0,212,255)"/>
                <stop offset="70%"  stop-color="rgb(255,107,53)"/>
                <stop offset="100%" stop-color="rgb(220,38,38)"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="logo-orbit"></div>
          <div class="logo-orbit logo-orbit-2"></div>
        </div>

        <!-- Title (hidden on very small screens) -->
        <div class="flex flex-col leading-none gap-0.5 hidden xs:flex sm:flex">
          <h1 class="text-sm md:text-base font-black tracking-[0.1em] gradient-text whitespace-nowrap">
            SPRING JAVA MASTERY
          </h1>
          <div class="flex items-center gap-1.5">
            <div class="header-underline-bar"></div>
            <span class="text-[9px] font-semibold tracking-widest uppercase hidden md:block"
                  style="color:rgba(0,212,255,0.5);">Deep Learning Platform</span>
          </div>
        </div>
      </div>

      <!-- ══ CENTER: Search ══ -->
      <div class="flex-1 mx-3 md:mx-6 relative z-10" [class.hidden]="!mobileSearchOpen">
        <!-- Desktop: always shown; Mobile: toggled -->
        <div class="search-field-wrap hidden md:block">
          <svg class="search-icon w-4 h-4" fill="none" viewBox="0 0 24 24"
               stroke-width="2" stroke="rgba(0,212,255,0.55)">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"/>
          </svg>
          <input type="text" [(ngModel)]="searchQuery"
                 (input)="onSearch()" (blur)="clearDelay()"
                 placeholder="Search topics — Beans, Kafka, GC..."
                 class="search-input"/>
          <div class="search-glow-line"></div>
        </div>

        <!-- Dropdown desktop -->
        <div *ngIf="searchResults.length > 0 && !mobileSearchOpen"
             class="search-dropdown hidden md:block animate-slide-down">
          <ul>
            <li *ngFor="let r of searchResults"
                (mousedown)="selectTopic(r.slug)"
                class="search-result-item">
              <div>
                <div class="text-sm font-semibold" style="color:rgb(220,235,248);">{{ r.title }}</div>
                <div class="text-xs mt-0.5" style="color:rgba(0,212,255,0.55);">
                  {{ r.moduleTitle }}
                  <span style="color:rgba(255,107,53,0.8)"> · {{ r.difficulty }}</span>
                </div>
              </div>
              <span class="badge-cyan text-[10px] flex-shrink-0">→</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Mobile search overlay -->
      <div *ngIf="mobileSearchOpen" class="mobile-search-overlay">
        <div class="search-field-wrap" style="flex:1;">
          <svg class="search-icon w-4 h-4" fill="none" viewBox="0 0 24 24"
               stroke-width="2" stroke="rgba(0,212,255,0.55)">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"/>
          </svg>
          <input #mobileInput
                 type="text" [(ngModel)]="searchQuery"
                 (input)="onSearch()" (blur)="clearMobileDelay()"
                 placeholder="Search topics..."
                 class="search-input" autofocus/>
        </div>
        <button class="close-search-btn" (click)="closeMobileSearch()">✕</button>

        <!-- Mobile search dropdown -->
        <div *ngIf="searchResults.length > 0" class="mobile-search-dropdown animate-slide-down">
          <ul>
            <li *ngFor="let r of searchResults"
                (mousedown)="selectTopic(r.slug); closeMobileSearch()"
                class="search-result-item">
              <div class="flex flex-col">
                <div class="text-sm font-semibold" style="color:rgb(220,235,248);">{{ r.title }}</div>
                <div class="text-xs" style="color:rgba(0,212,255,0.55);">{{ r.moduleTitle }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- ══ RIGHT: Actions ══ -->
      <div class="flex items-center gap-2 relative z-10 flex-shrink-0">

        <!-- Mobile search icon -->
        <button class="search-icon-btn md:hidden"
                (click)="openMobileSearch()"
                aria-label="Search">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"/>
          </svg>
        </button>

        <!-- Language Toggle Pill -->
        <div class="lang-toggle-pill" title="Toggle English / Hinglish">
          <button class="lang-btn" [class.active-en]="!hs.isHinglish"
                  (click)="hs.setHinglish(false)">EN</button>
          <div class="lang-separator"></div>
          <button class="lang-btn" [class.active-hi]="hs.isHinglish"
                  (click)="hs.setHinglish(true)">HI</button>
        </div>

        <!-- Session + Avatar -->
        <div class="hidden lg:flex flex-col items-end leading-none gap-0.5">
          <div class="text-[10px] font-bold uppercase tracking-widest"
               style="color:rgba(0,212,255,0.45);">Session</div>
          <div class="text-[11px] font-mono" style="color:rgb(0,212,255);">
            {{ sessionId.substring(0,10) }}…
          </div>
        </div>
        <div class="avatar-circle">U</div>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }

    /* ── Header shell ── */
    .header-main {
      background: rgba(4,8,22,0.9) !important;
      border: 1px solid rgba(0,212,255,0.18);
      border-radius: 18px;
      box-shadow: 0 4px 40px rgba(0,0,0,0.6),
                  0 0 0 1px rgba(0,212,255,0.05),
                  inset 0 1px 0 rgba(255,255,255,0.03);
      overflow: hidden;
      animation: header-border-cycle 8s linear infinite;
    }
    @keyframes header-border-cycle {
      0%   { border-color: rgba(0,212,255,0.2); }
      20%  { border-color: rgba(0,255,157,0.18); }
      40%  { border-color: rgba(255,107,53,0.2); }
      60%  { border-color: rgba(220,38,38,0.18); }
      80%  { border-color: rgba(160,82,45,0.18); }
      100% { border-color: rgba(0,212,255,0.2); }
    }

    /* ── Sparkle particles ── */
    .header-particles { position:absolute; inset:0; pointer-events:none; overflow:hidden; border-radius:18px; }
    .hsp { position:absolute; font-size:0.55rem; animation:hsp-float 5s ease-in-out infinite; opacity:0; }
    .hsp-1 { left:8%;  top:30%; color:rgb(0,212,255);  animation-delay:0s;   animation-duration:4.5s; }
    .hsp-2 { left:22%; top:60%; color:rgb(0,255,157);  animation-delay:0.8s; animation-duration:5.5s; }
    .hsp-3 { left:45%; top:20%; color:rgb(255,107,53); animation-delay:1.6s; animation-duration:4s; }
    .hsp-4 { left:70%; top:65%; color:rgb(220,38,38);  animation-delay:2.4s; animation-duration:6s; }
    .hsp-5 { left:88%; top:35%; color:rgb(0,255,157);  animation-delay:3.2s; animation-duration:5s; }
    @keyframes hsp-float {
      0%,100% { transform:translateY(0) scale(0.5); opacity:0; }
      30%      { transform:translateY(-8px) scale(1); opacity:0.7; }
      70%      { transform:translateY(-14px) scale(0.8); opacity:0.4; }
    }

    /* ── Hamburger ── */
    .hamburger-btn {
      display: flex; flex-direction: column; gap: 4px;
      padding: 8px; border-radius: 10px; border: none;
      background: rgba(0,212,255,0.08);
      border: 1px solid rgba(0,212,255,0.2);
      cursor: pointer; transition: all 0.25s ease;
    }
    .hamburger-btn:hover { background: rgba(0,212,255,0.16); }
    .ham-line {
      width: 18px; height: 2px; border-radius: 999px;
      background: rgb(0,212,255); transition: all 0.3s ease;
    }
    .ham-line-mid { width: 14px; }

    /* ── Logo ── */
    .logo-wrap {
      position:relative; width:38px; height:38px;
      display:flex; align-items:center; justify-content:center;
      border-radius:11px;
      background:rgba(0,212,255,0.07);
      border:1px solid rgba(0,212,255,0.2);
      flex-shrink: 0;
    }
    .logo-orbit {
      position:absolute; inset:-4px; border-radius:50%;
      border:1.5px dashed rgba(0,212,255,0.2);
      animation:spin 10s linear infinite; pointer-events:none;
    }
    .logo-orbit-2 { inset:-9px; border-color:rgba(0,255,157,0.12); animation-duration:16s; animation-direction:reverse; }
    @keyframes spin { to { transform:rotate(360deg); } }

    .header-underline-bar {
      height:1.5px; width:28px; border-radius:999px;
      background:linear-gradient(90deg, rgb(0,212,255), rgb(0,255,157), rgb(255,107,53), rgb(220,38,38));
      background-size:200% 100%; animation:rgb-bar 3s linear infinite;
    }
    @keyframes rgb-bar { 0% { background-position:0%; } 100% { background-position:200%; } }

    /* ── Search ── */
    .search-field-wrap { position:relative; }
    .search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); }
    .search-input {
      width:100%; padding:8px 14px 8px 36px;
      background:rgba(0,212,255,0.04);
      border:1px solid rgba(0,212,255,0.13);
      border-radius:11px;
      color:rgb(220,235,248); font-size:0.8rem;
      font-family:'Poppins',sans-serif; outline:none; transition:all 0.3s ease;
    }
    .search-input:focus {
      background:rgba(0,212,255,0.08);
      border-color:rgba(0,212,255,0.45);
      box-shadow:0 0 0 3px rgba(0,212,255,0.1);
    }
    .search-glow-line {
      position:absolute; bottom:0; left:20%; right:20%; height:1px; border-radius:999px;
      background:linear-gradient(90deg, transparent, rgb(0,212,255), rgb(0,255,157), transparent);
      opacity:0; transition:opacity 0.3s ease;
    }
    .search-field-wrap:focus-within .search-glow-line { opacity:0.5; }

    .search-dropdown {
      position:absolute; left:0; right:0; top:calc(100% + 8px);
      background:rgba(4,8,22,0.97); backdrop-filter:blur(24px);
      border:1px solid rgba(0,212,255,0.18); border-radius:14px;
      box-shadow:0 20px 60px rgba(0,0,0,0.7);
      max-height:260px; overflow-y:auto; z-index:99;
    }
    .search-result-item {
      display:flex; align-items:center; justify-content:space-between;
      padding:11px 15px; cursor:pointer;
      border-bottom:1px solid rgba(0,212,255,0.05);
      transition:background 0.2s ease;
    }
    .search-result-item:hover { background:rgba(0,212,255,0.06); }
    .search-result-item:last-child { border-bottom:none; }

    /* ── Mobile search ── */
    .search-icon-btn {
      padding:8px; border-radius:10px; border:none;
      background:rgba(0,212,255,0.07);
      border:1px solid rgba(0,212,255,0.18);
      color:rgb(0,212,255); cursor:pointer; transition:all 0.25s ease;
    }
    .search-icon-btn:hover { background:rgba(0,212,255,0.15); }

    .mobile-search-overlay {
      position:fixed; top:0; left:0; right:0; z-index:300;
      background:rgba(4,8,22,0.97); backdrop-filter:blur(24px);
      padding:16px; display:flex; align-items:center; gap:10px;
      border-bottom:1px solid rgba(0,212,255,0.2);
      animation:slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { transform:translateY(-100%); opacity:0; }
      to   { transform:translateY(0); opacity:1; }
    }
    .mobile-search-overlay .search-input { width:100%; }
    .close-search-btn {
      padding:8px 12px; border-radius:8px; border:none;
      background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.25);
      color:rgb(220,38,38); cursor:pointer; font-size:0.9rem; flex-shrink:0;
      transition:all 0.25s ease;
    }
    .close-search-btn:hover { background:rgba(220,38,38,0.2); }

    .mobile-search-dropdown {
      position:absolute; top:100%; left:0; right:0;
      background:rgba(4,8,22,0.98); backdrop-filter:blur(24px);
      border:1px solid rgba(0,212,255,0.18); border-top:none;
      max-height:60vh; overflow-y:auto;
    }

    /* ── Avatar ── */
    .avatar-circle {
      width:34px; height:34px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      font-weight:800; font-size:0.82rem;
      background:rgba(0,212,255,0.1); border:1.5px solid rgba(0,212,255,0.3);
      color:rgb(0,212,255); flex-shrink:0;
      animation:avatar-pulse 3s ease-in-out infinite;
    }
    @keyframes avatar-pulse {
      0%,100% { box-shadow:0 0 0 0 rgba(0,212,255,0.2); }
      50%      { box-shadow:0 0 0 5px rgba(0,212,255,0.04); }
    }

    /* ── Responsive ── */
    @media (max-width: 380px) {
      .header-main { padding: 8px 12px; }
      .logo-wrap { width:34px; height:34px; }
    }
  `]
})
export class Header implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();

  searchQuery = '';
  searchResults: TopicResponse[] = [];
  sessionId = 'user-session-12345';
  mobileSearchOpen = false;
  private clearTimer: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    public hs: HinglishService
  ) {}

  ngOnInit() {
    const saved = localStorage.getItem('springmastery_session');
    if (saved) {
      this.sessionId = saved;
    } else {
      this.sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('springmastery_session', this.sessionId);
    }
  }

  setLang(hi: boolean) { this.hs.setHinglish(hi); }

  openMobileSearch() {
    this.mobileSearchOpen = true;
    setTimeout(() => {
      const el = document.querySelector('.mobile-search-overlay input') as HTMLInputElement;
      if (el) el.focus();
    }, 100);
  }
  closeMobileSearch() {
    this.mobileSearchOpen = false;
    this.searchResults = [];
    this.searchQuery = '';
  }

  onSearch() {
    if (this.searchQuery.trim().length < 2) { this.searchResults = []; return; }
    this.apiService.search(this.searchQuery).subscribe({
      next: (d) => { this.searchResults = d; },
      error: () => {}
    });
  }

  clearDelay() {
    this.clearTimer = setTimeout(() => { this.searchResults = []; }, 200);
  }
  clearMobileDelay() {
    this.clearTimer = setTimeout(() => {
      if (!this.mobileSearchOpen) this.searchResults = [];
    }, 200);
  }

  selectTopic(slug: string) {
    clearTimeout(this.clearTimer);
    this.searchResults = [];
    this.searchQuery = '';
    this.router.navigate(['/topic', slug]);
  }
}
