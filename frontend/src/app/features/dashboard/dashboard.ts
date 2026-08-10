import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService, DashboardStatsResponse, TopicResponse } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col gap-6" *ngIf="stats">
      <!-- Welcome card -->
      <div class="glass-panel px-5 md:px-8 py-7 md:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 neon-glow-cyan">
        <div class="flex flex-col gap-2">
          <h2 class="text-xl md:text-3xl font-extrabold tracking-tight leading-snug">
            Welcome to <span class="neon-text-green">Spring Java Mastery</span>
          </h2>
          <p class="text-gray-400 text-xs md:text-sm max-w-xl leading-relaxed">
            Track your progress across 10 modules and 192 topics. Solve interactive quizzes, review standard interview questions, and study complete code patterns.
          </p>
        </div>
        <div class="flex items-center gap-3 self-end md:self-center">
          <div class="text-center bg-white/5 border border-white/10 px-4 md:px-6 py-3 md:py-4 rounded-2xl">
            <div class="text-xl md:text-2xl font-black text-cyan-400">{{ stats.overallCompletionPercentage | number:'1.0-1' }}%</div>
            <div class="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wide">Completed</div>
          </div>
          <div class="text-center bg-white/5 border border-white/10 px-4 md:px-6 py-3 md:py-4 rounded-2xl">
            <div class="text-xl md:text-2xl font-black text-green-400">{{ stats.averageQuizScore | number:'1.0-1' }}%</div>
            <div class="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wide">Quiz Avg</div>
          </div>
        </div>
      </div>

      <!-- Stats Grid (2x2 on mobile, 4-col on desktop) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        <div class="glass-card p-4 md:p-6 flex flex-col gap-1.5">
          <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Modules</div>
          <div class="text-2xl md:text-3xl font-black" style="color:rgb(0,212,255);">{{ stats.totalModules }}</div>
        </div>
        <div class="glass-card p-4 md:p-6 flex flex-col gap-1.5">
          <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Topics</div>
          <div class="text-2xl md:text-3xl font-black text-gray-200">{{ stats.totalTopics }}</div>
        </div>
        <div class="glass-card p-4 md:p-6 flex flex-col gap-1.5">
          <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Completed</div>
          <div class="text-2xl md:text-3xl font-black" style="color:rgb(0,255,157);">{{ stats.completedTopics }}</div>
        </div>
        <div class="glass-card p-4 md:p-6 flex flex-col gap-1.5">
          <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">In Progress</div>
          <div class="text-2xl md:text-3xl font-black" style="color:rgb(255,107,53);">{{ stats.inProgressTopics }}</div>
        </div>
      </div>

      <!-- Main Panels -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Recommended Topics -->
        <div class="glass-panel p-6 flex flex-col gap-4">
          <h3 class="text-lg font-bold tracking-wide neon-text-cyan">Recommended Topics</h3>
          <div class="flex flex-col gap-3">
            <a 
              *ngFor="let topic of stats.recommendedTopics"
              [routerLink]="['/topic', topic.slug]"
              class="glass-card p-4 flex items-center justify-between hover:border-cyan-400/30 transition-all">
              <div class="flex flex-col gap-1">
                <div class="text-sm font-semibold text-gray-200">{{ topic.title }}</div>
                <div class="text-xs text-gray-400">{{ topic.moduleTitle }}</div>
              </div>
              <span class="text-xs px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-medium">
                {{ topic.difficulty }}
              </span>
            </a>
            <div *ngIf="stats.recommendedTopics.length === 0" class="text-sm text-gray-500 py-4 text-center">
              No recommendations available. Start exploring topics in the sidebar!
            </div>
          </div>
        </div>

        <!-- Weak Topics (Review Required) -->
        <div class="glass-panel p-6 flex flex-col gap-4">
          <h3 class="text-lg font-bold tracking-wide neon-text-orange">Review Required (Weak Topics)</h3>
          <div class="flex flex-col gap-3">
            <a 
              *ngFor="let topic of stats.weakTopics"
              [routerLink]="['/topic', topic.slug]"
              class="glass-card p-4 flex items-center justify-between hover:border-orange-400/30 transition-all">
              <div class="flex flex-col gap-1">
                <div class="text-sm font-semibold text-gray-200">{{ topic.title }}</div>
                <div class="text-xs text-gray-400">Score below 60%</div>
              </div>
              <span class="text-xs px-2.5 py-1 rounded bg-orange-950/50 text-orange-400 border border-orange-900 font-medium">
                Review Note
              </span>
            </a>
            <div *ngIf="stats.weakTopics.length === 0" class="text-sm text-gray-500 py-8 text-center flex-center flex-col gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-green-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              No weak areas detected! Keep up the excellent work!
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div *ngIf="loading" class="flex-center flex-col gap-4 h-64">
      <div class="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
      <div class="text-sm text-gray-400">Loading learning dashboard...</div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    a { text-decoration: none; }
    .glass-card { transition: all 0.3s ease; }
    @media (max-width: 480px) {
      .glass-panel { padding: 16px !important; }
    }
  `]
})
export class Dashboard implements OnInit {
  stats: DashboardStatsResponse | null = null;
  loading = true;
  sessionId = 'user-session-12345';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    const saved = localStorage.getItem('springmastery_session');
    if (saved) {
      this.sessionId = saved;
    }
  }

  ngOnInit() {
    this.apiService.getDashboardStats(this.sessionId).subscribe({
      next: (data: DashboardStatsResponse) => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load dashboard stats', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
