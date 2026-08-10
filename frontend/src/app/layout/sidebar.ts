import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { ApiService, ModuleResponse, TopicResponse } from '../core/services/api.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar-container" [class.sidebar-open]="isOpen">

      <!-- ── Nav Quick Links ── -->
      <div class="flex flex-col gap-1 mb-2">
        <a routerLink="/dashboard"
           (click)="close()"
           class="sidebar-nav-link">
          <span class="sidebar-icon" style="color:rgb(0,212,255)">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
            </svg>
          </span>
          Learning Dashboard
        </a>
        <a routerLink="/graph"
           (click)="close()"
           class="sidebar-nav-link">
          <span class="sidebar-icon" style="color:rgb(0,255,157)">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
            </svg>
          </span>
          Knowledge Graph
        </a>
      </div>

      <div class="sidebar-divider"></div>

      <!-- ── Module List ── -->
      <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
        Educational Modules
      </div>

      <div class="flex flex-col gap-0.5 overflow-y-auto flex-1">
        <div *ngFor="let module of modules; let mi = index" class="flex flex-col">
          <button
            (click)="toggleModule(module.id)"
            class="sidebar-module-btn"
            [class.module-active]="activeModuleId === module.id">
            <span class="flex items-center gap-3 min-w-0">
              <span class="module-dot"
                    [style.background]="moduleColors[mi % moduleColors.length]"
                    [style.box-shadow]="'0 0 6px ' + moduleColors[mi % moduleColors.length]">
              </span>
              <span class="truncate text-sm">{{ module.title }}</span>
            </span>
            <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                 class="w-3.5 h-3.5 flex-shrink-0 text-gray-500 transition-transform duration-300"
                 [style.transform]="expandedModuleId === module.id ? 'rotate(90deg)' : 'rotate(0deg)'">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
            </svg>
          </button>

          <!-- Topics dropdown -->
          <div *ngIf="expandedModuleId === module.id"
               class="topics-list">
            <div *ngIf="loadingTopics" class="text-xs text-gray-500 py-2 pl-5">
              Loading…
            </div>
            <a *ngFor="let topic of topics"
               [routerLink]="['/topic', topic.slug]"
               (click)="close()"
               routerLinkActive="topic-active"
               [routerLinkActiveOptions]="{exact: true}"
               class="topic-link truncate">
              <span class="topic-num">{{ topic.displayOrder }}</span>
              {{ topic.title }}
            </a>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host { display: contents; }

    /* ── Sidebar Container ── */
    .sidebar-container {
      width: 272px;
      height: calc(100vh - 120px);
      background: rgba(4, 8, 22, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(0,212,255,0.12);
      border-radius: 16px;
      padding: 16px 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
    }

    /* ── Mobile: Drawer ── */
    @media (max-width: 767px) {
      .sidebar-container {
        position: fixed;
        left: 0; top: 0; bottom: 0;
        width: 290px;
        height: 100dvh;
        border-radius: 0 20px 20px 0;
        z-index: 200;
        transform: translateX(-100%);
        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                    box-shadow 0.35s ease;
        border: none;
        border-right: 1px solid rgba(0,212,255,0.18);
        box-shadow: none;
        padding: 56px 10px 20px;
      }
      .sidebar-container.sidebar-open {
        transform: translateX(0);
        box-shadow: 8px 0 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.08);
      }
    }

    /* ── Nav Links ── */
    .sidebar-nav-link {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; border-radius: 12px;
      font-size: 0.82rem; font-weight: 600;
      color: rgba(180,200,220,0.8);
      transition: all 0.25s ease; text-decoration: none;
    }
    .sidebar-nav-link:hover {
      background: rgba(0,212,255,0.07);
      color: rgb(220,235,248);
    }
    .sidebar-icon { display: flex; align-items: center; flex-shrink: 0; }

    /* ── Divider ── */
    .sidebar-divider {
      height: 1px; margin: 6px 0;
      background: linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent);
    }

    /* ── Module Button ── */
    .sidebar-module-btn {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      padding: 9px 12px; border-radius: 12px; border: none;
      font-size: 0.8rem; font-weight: 500; text-align: left;
      color: rgba(170,190,215,0.8); background: transparent;
      cursor: pointer; transition: all 0.25s ease;
      font-family: 'Poppins', sans-serif;
    }
    .sidebar-module-btn:hover {
      background: rgba(0,212,255,0.06);
      color: rgb(220,235,248);
    }
    .module-active {
      background: rgba(0,212,255,0.1) !important;
      color: rgb(0,212,255) !important;
    }
    .module-dot {
      width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
    }

    /* ── Topics list ── */
    .topics-list {
      padding: 4px 0 4px 18px;
      margin: 2px 0 4px;
      border-left: 1px solid rgba(0,212,255,0.12);
      margin-left: 18px;
      display: flex; flex-direction: column; gap: 1px;
    }
    .topic-link {
      display: block; padding: 5px 10px; border-radius: 8px;
      font-size: 0.74rem; font-weight: 500;
      color: rgba(150,175,200,0.7);
      text-decoration: none; transition: all 0.2s ease;
    }
    .topic-link:hover { background: rgba(0,212,255,0.06); color: rgb(220,235,248); }
    .topic-active { color: rgb(0,255,157) !important; font-weight: 700 !important; }
    .topic-num {
      display: inline-block; font-size: 0.65rem; font-weight: 700;
      color: rgba(0,212,255,0.5); margin-right: 5px; font-family: 'Fira Code', monospace;
    }
  `]
})
export class Sidebar implements OnInit {
  @Input() isOpen = false;
  @Output() closeDrawer = new EventEmitter<void>();

  modules: ModuleResponse[] = [];
  topics: TopicResponse[] = [];
  activeModuleId: number | null = null;
  expandedModuleId: number | null = null;
  loadingTopics = false;

  moduleColors = [
    'rgb(0,212,255)', 'rgb(0,255,157)', 'rgb(255,107,53)',
    'rgb(220,38,38)', 'rgb(160,82,45)', 'rgb(0,212,255)',
    'rgb(0,255,157)', 'rgb(255,107,53)', 'rgb(220,38,38)', 'rgb(160,82,45)'
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.apiService.getModules().subscribe({
      next: (data) => { this.modules = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  close() {
    this.closeDrawer.emit();
  }

  toggleModule(moduleId: number) {
    this.activeModuleId = moduleId;
    if (this.expandedModuleId === moduleId) {
      this.expandedModuleId = null;
      this.topics = [];
    } else {
      this.expandedModuleId = moduleId;
      this.loadModuleTopics(moduleId);
    }
    this.cdr.detectChanges();
  }

  loadModuleTopics(moduleId: number) {
    const module = this.modules.find(m => m.id === moduleId);
    if (!module) return;
    this.loadingTopics = true;
    this.cdr.detectChanges();
    this.apiService.getModuleTopics(module.slug).subscribe({
      next: (data) => { this.topics = data; this.loadingTopics = false; this.cdr.detectChanges(); },
      error: () => { this.loadingTopics = false; this.cdr.detectChanges(); }
    });
  }
}
