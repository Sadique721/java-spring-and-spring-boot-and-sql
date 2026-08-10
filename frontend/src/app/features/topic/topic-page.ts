import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService, TopicDetailResponse, QuizQuestionResponse, InterviewQuestionResponse } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HinglishService } from '../../core/services/hinglish.service';

@Component({
  selector: 'app-topic-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex flex-col gap-6" *ngIf="topic">

      <!-- ══ TOPIC HEADER CARD ══ -->
      <div class="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 topic-header-card animate-fade-up">
        <!-- Rainbow left border accent -->
        <div class="topic-left-accent"></div>

        <div class="flex flex-col gap-1 pl-3">
          <!-- Module breadcrumb -->
          <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span class="w-1.5 h-1.5 rounded-full inline-block" style="background:rgb(0,212,255);"></span>
            <span style="color:rgb(0,212,255);">{{ topic.moduleTitle }}</span>
          </div>

          <!-- Title -->
          <h2 class="text-2xl font-black mt-0.5 text-gray-100">
            {{ hi(topic.title) }}
          </h2>
          <p class="text-xs mt-0.5" style="color:rgba(200,215,230,0.6);">{{ hi(topic.subtitle) }}</p>

          <!-- Hinglish badge when active -->
          <div *ngIf="hs.isHinglish" class="hinglish-tag mt-1.5" style="display:inline-flex;width:fit-content;">
            🇮🇳 Hinglish Mode ON
          </div>
        </div>

        <div class="flex flex-col items-end gap-3">
          <!-- Difficulty + Time row -->
          <div class="flex items-center gap-3">
            <span class="badge-{{ difficultyColor(topic.difficulty) }} uppercase font-black text-[10px]">
              {{ topic.difficulty }}
            </span>
            <span class="text-xs font-semibold" style="color:rgba(200,212,255,0.5);">
              ⏱ {{ topic.estimatedMinutes }} mins
            </span>
          </div>

          <!-- Progress bar -->
          <div class="w-44">
            <div class="flex justify-between text-[10px] mb-1" style="color:rgba(0,212,255,0.6);">
              <span>Progress</span>
              <span>{{ topic.completionPercentage | number:'1.0-0' }}%</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" [style.width.%]="topic.completionPercentage"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ PATHWAY TABS ══ -->
      <div class="flex overflow-x-auto gap-1.5 pb-1 pathway-tabs-row">
        <button
          *ngFor="let path of pathways"
          (click)="switchPathway(path.id)"
          class="pathway-tab-btn"
          [class.pathway-tab-active]="activePathway === path.id">
          <span class="tab-icon">{{ path.icon }}</span>
          {{ path.name }}
        </button>
      </div>

      <!-- ══ MAIN GRID ══ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">

        <!-- ── Content Panel (Left/Center) ── -->
        <div class="lg:col-span-2 flex flex-col gap-5">

          <!-- FOUNDATIONS & DEEP DIVE (Tabs 1 & 2) -->
          <div *ngIf="activePathway === 'foundations' || activePathway === 'deep-dive'"
               class="glass-panel p-6 flex flex-col gap-6 animate-fade-up">

            <!-- Panel header with section counter -->
            <div class="flex items-center justify-between">
              <h3 class="text-base font-black uppercase tracking-wider"
                  [style.color]="activePathway === 'foundations' ? 'rgb(0,212,255)' : 'rgb(0,255,157)'"
                  style="text-shadow: 0 0 10px currentColor;">
                {{ activePathway === 'foundations' ? '📘 Core Concepts' : '🔬 Technical Deep Dive' }}
              </h3>
              <span class="page-info">
                {{ currentPage }}/{{ totalPages }} · {{ pagedSections().length }} sections
              </span>
            </div>

            <div class="rgb-separator"></div>

            <!-- Sections list (paginated) -->
            <div class="flex flex-col gap-6 animate-fade-in">
              <div *ngFor="let section of pagedSections(); let i = index"
                   class="section-card" [style.animation-delay]="(i*0.06)+'s'">

                <!-- Section number + title -->
                <div class="flex items-start gap-3">
                  <div class="section-number-badge">
                    {{ section.sectionNumber }}
                  </div>
                  <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                    <h4 class="text-sm font-bold text-gray-100">{{ hi(section.sectionTitle) }}</h4>
                    <p class="text-xs leading-relaxed" style="color:rgba(190,210,230,0.75);">
                      {{ hi(section.content) }}
                    </p>
                  </div>
                </div>
              </div>

              <div *ngIf="pagedSections().length === 0"
                   class="text-center py-10 text-sm" style="color:rgba(120,140,170,0.7);">
                No sections available for this tab yet.
              </div>
            </div>

            <!-- ── PAGINATION ── -->
            <div *ngIf="totalPages > 1" class="pagination-bar">
              <button class="page-btn page-btn-nav"
                      [disabled]="currentPage === 1"
                      (click)="goPage(currentPage - 1)">← Prev</button>

              <ng-container *ngFor="let p of pageNumbers">
                <span *ngIf="p === -1" class="page-info">…</span>
                <button *ngIf="p !== -1"
                        class="page-btn"
                        [class.active]="p === currentPage"
                        (click)="goPage(p)">{{ p }}</button>
              </ng-container>

              <button class="page-btn page-btn-nav"
                      [disabled]="currentPage === totalPages"
                      (click)="goPage(currentPage + 1)">Next →</button>
            </div>
          </div>

          <!-- CODE LAB (Tab 3) -->
          <div *ngIf="activePathway === 'code-lab'" class="flex flex-col gap-5 animate-fade-up">
            <div *ngFor="let code of topic.codeExamples; let ci = index"
                 class="glass-panel p-6 flex flex-col gap-3 code-card"
                 [style.animation-delay]="(ci*0.08)+'s'">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="text-xs font-bold uppercase tracking-wider neon-text-cyan">
                  {{ code.title }}
                </span>
                <div class="flex items-center gap-2">
                  <span class="badge-{{ levelColor(code.level) }} text-[10px]">{{ code.level }}</span>
                  <button (click)="copyCode(code.code, ci)" class="copy-code-btn"
                          [class.copied]="copiedIdx === ci">
                    {{ copiedIdx === ci ? '✓ Copied!' : 'Copy' }}
                  </button>
                </div>
              </div>

              <!-- Code block -->
              <div class="code-block relative">
                <pre><code class="text-gray-300 text-xs leading-relaxed">{{ code.code }}</code></pre>
              </div>

              <p class="text-xs leading-relaxed" style="color:rgba(180,200,220,0.7);">
                {{ hi(code.explanation) }}
              </p>
            </div>

            <div *ngIf="topic.codeExamples.length === 0"
                 class="glass-panel p-10 text-center text-sm" style="color:rgba(120,140,170,0.7);">
              No code examples for this topic yet.
            </div>
          </div>

          <!-- EXAM PREP — QUIZ (Tab 4) -->
          <div *ngIf="activePathway === 'exam-prep'" class="flex flex-col gap-5 animate-fade-up">

            <!-- Quiz -->
            <div class="glass-panel p-6 flex flex-col gap-5">
              <h3 class="text-sm font-black uppercase tracking-wider neon-text-green">
                ✦ Concept Verification Quiz
              </h3>

              <div class="flex flex-col gap-6">
                <div *ngFor="let q of topic.quizQuestions; let i = index"
                     class="quiz-question-block">
                  <!-- Question text -->
                  <div class="text-sm font-semibold text-gray-100 mb-3">
                    <span class="quiz-q-num">Q{{ i+1 }}</span>
                    {{ hi(q.question) }}
                  </div>

                  <!-- Options -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      *ngFor="let opt of q.options; let oi = index"
                      (click)="selectQuizAnswer(i, oi)"
                      class="quiz-option text-xs"
                      [class.correct]="quizSubmitted[i] && oi === q.correctAnswerIndex"
                      [class.wrong]="quizSubmitted[i] && quizAnswers[i] === oi && oi !== q.correctAnswerIndex"
                      [class.disabled]="quizSubmitted[i]">
                      <span class="opt-label">{{ optLabels[oi] }}</span>
                      {{ hi(opt) }}
                    </button>
                  </div>

                  <!-- Explanation after answer -->
                  <div *ngIf="quizSubmitted[i]"
                       class="mt-3 p-3 rounded-xl text-xs leading-relaxed animate-slide-down"
                       style="background:rgba(0,255,157,0.06);border:1px solid rgba(0,255,157,0.15);color:rgba(180,220,200,0.9);">
                    <span class="font-bold neon-text-green">💡 Explanation: </span>
                    {{ hi(q.explanation) }}
                  </div>
                </div>

                <div *ngIf="topic.quizQuestions.length === 0"
                     class="text-sm text-center py-6" style="color:rgba(120,140,170,0.7);">
                  No quiz questions for this topic.
                </div>
              </div>

              <!-- Quiz score summary -->
              <div *ngIf="quizScore !== null"
                   class="flex items-center justify-between p-4 rounded-xl mt-2 quiz-score-card">
                <span class="text-sm font-bold" style="color:rgba(220,235,248,0.9);">Your Score</span>
                <span class="text-2xl font-black"
                      [style.color]="quizScore >= 70 ? 'rgb(0,255,157)' : quizScore >= 40 ? 'rgb(255,107,53)' : 'rgb(220,38,38)'">
                  {{ quizScore | number:'1.0-1' }}%
                </span>
              </div>
            </div>

            <!-- Interview Questions -->
            <div class="glass-panel p-6 flex flex-col gap-4">
              <h3 class="text-sm font-black uppercase tracking-wider neon-text-cyan">
                🎯 Interview Question Simulator
              </h3>

              <div class="flex flex-col gap-4">
                <div *ngFor="let q of topic.interviewQuestions; let idx = index"
                     class="interview-card">
                  <div class="flex items-center justify-between mb-2">
                    <span class="badge-cyan text-[10px]">{{ q.category }}</span>
                    <span class="badge-{{ q.difficulty === 'HARD' ? 'red' : q.difficulty === 'MEDIUM' ? 'orange' : 'green' }} text-[10px]">
                      {{ q.difficulty }}
                    </span>
                  </div>
                  <div class="text-sm font-semibold text-gray-100 mb-3">{{ hi(q.question) }}</div>

                  <button (click)="revealedAnswers[idx] = !revealedAnswers[idx]"
                          class="reveal-btn">
                    {{ revealedAnswers[idx] ? '🙈 Hide Answer' : '👁 Reveal Answer Pattern' }}
                  </button>

                  <div *ngIf="revealedAnswers[idx]"
                       class="mt-3 text-xs leading-relaxed animate-slide-down"
                       style="color:rgba(180,205,225,0.85);border-top:1px solid rgba(0,212,255,0.1);padding-top:12px;">
                    <div class="font-bold neon-text-cyan mb-1">📝 Standard Answer:</div>
                    {{ hi(q.answer) }}

                    <div *ngIf="q.interviewTip"
                         class="mt-2 p-2 rounded-lg text-xs"
                         style="background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.15);color:rgba(0,212,255,0.85);">
                      <span class="font-bold">💡 Pro Tip:</span> {{ hi(q.interviewTip) }}
                    </div>
                  </div>
                </div>

                <div *ngIf="topic.interviewQuestions.length === 0"
                     class="text-sm text-center py-6" style="color:rgba(120,140,170,0.7);">
                  No interview questions uploaded yet.
                </div>
              </div>
            </div>
          </div>

          <!-- PRO TIPS (Tab 5) -->
          <div *ngIf="activePathway === 'pro-tips' && topic.revisionNotes"
               class="glass-panel p-6 flex flex-col gap-5 animate-fade-up">
            <h3 class="text-base font-black uppercase tracking-wider neon-text-orange">
              🧠 Revision &amp; Memory Sheets
            </h3>
            <div class="rgb-separator"></div>

            <p class="text-xs leading-relaxed" style="color:rgba(190,210,230,0.75);">
              {{ hi(topic.revisionNotes.content) }}
            </p>

            <!-- Key Points -->
            <div class="flex flex-col gap-2">
              <h4 class="text-xs font-bold uppercase tracking-wider" style="color:rgba(200,215,230,0.7);">
                ✓ Key Points Checklist
              </h4>
              <ul class="flex flex-col gap-2">
                <li *ngFor="let pt of topic.revisionNotes.keyPoints"
                    class="flex items-start gap-2.5 text-xs leading-relaxed"
                    style="color:rgba(180,205,225,0.8);">
                  <span class="neon-text-green mt-0.5 flex-shrink-0">✓</span>
                  {{ hi(pt) }}
                </li>
              </ul>
            </div>

            <!-- Memory Tricks -->
            <div *ngIf="topic.revisionNotes.memoryTricks.length > 0" class="flex flex-col gap-2">
              <h4 class="text-xs font-bold uppercase tracking-wider" style="color:rgba(200,215,230,0.7);">
                🎯 Mnemonics &amp; Memory Tricks
              </h4>
              <ul class="flex flex-col gap-2">
                <li *ngFor="let trick of topic.revisionNotes.memoryTricks"
                    class="p-3 rounded-xl text-xs"
                    style="background:rgba(255,107,53,0.07);border:1px solid rgba(255,107,53,0.2);color:rgb(200,120,70);">
                  {{ hi(trick) }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ── Right Sidebar ── -->
        <div class="flex flex-col gap-5">

          <!-- Topic Progression -->
          <div class="glass-panel p-5 flex flex-col gap-3">
            <div class="text-[10px] font-bold uppercase tracking-widest mb-1"
                 style="color:rgba(0,212,255,0.5);">Topic Progression</div>

            <a *ngIf="topic.previousTopic"
               [routerLink]="['/topic', topic.previousTopic.slug]"
               class="nav-topic-btn nav-prev">
              <div class="nav-arrow-icon">←</div>
              <div class="flex flex-col">
                <span class="text-[10px] font-bold uppercase" style="color:rgba(0,212,255,0.5);">Previous</span>
                <span class="text-xs text-gray-200 font-medium mt-0.5 truncate max-w-[160px]">
                  {{ topic.previousTopic.title }}
                </span>
              </div>
            </a>

            <a *ngIf="topic.nextTopic"
               [routerLink]="['/topic', topic.nextTopic.slug]"
               class="nav-topic-btn nav-next">
              <div class="flex flex-col flex-1">
                <span class="text-[10px] font-bold uppercase" style="color:rgba(0,255,157,0.5);">Next</span>
                <span class="text-xs text-gray-200 font-medium mt-0.5 truncate max-w-[160px]">
                  {{ topic.nextTopic.title }}
                </span>
              </div>
              <div class="nav-arrow-icon nav-arrow-green">→</div>
            </a>

            <div *ngIf="!topic.previousTopic && !topic.nextTopic"
                 class="text-xs text-center py-2" style="color:rgba(120,140,160,0.7);">
              No adjacent topics found.
            </div>
          </div>

          <!-- Mark Completion -->
          <div class="glass-panel p-5 flex flex-col gap-3">
            <div class="text-[10px] font-bold uppercase tracking-widest mb-1"
                 style="color:rgba(0,212,255,0.5);">Mark Completion</div>
            <button (click)="completeTopic()" class="complete-btn"
                    [class.completed]="isCompleted">
              {{ isCompleted ? '✓ Completed! Well done!' : '🚀 Mark as Completed' }}
            </button>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" [style.width.%]="topic.completionPercentage"></div>
            </div>
            <div class="text-center text-[11px] font-bold" style="color:rgba(0,212,255,0.6);">
              {{ topic.completionPercentage | number:'1.0-0' }}% done
            </div>
          </div>

          <!-- Language Toggle Card -->
          <div class="glass-panel p-5 flex flex-col gap-3">
            <div class="text-[10px] font-bold uppercase tracking-widest mb-1"
                 style="color:rgba(255,107,53,0.6);">Language Mode</div>
            <div class="lang-toggle-pill">
              <button class="lang-btn flex-1 justify-center"
                      [class.active-en]="!hs.isHinglish"
                      (click)="hs.setHinglish(false)">
                🇬🇧 English
              </button>
              <div class="lang-separator"></div>
              <button class="lang-btn flex-1 justify-center"
                      [class.active-hi]="hs.isHinglish"
                      (click)="hs.setHinglish(true)">
                🇮🇳 Hinglish
              </button>
            </div>
            <p class="text-[10px] leading-relaxed" style="color:rgba(150,165,185,0.65);">
              {{ hs.isHinglish ? 'Sabhi concepts ab Hinglish me dikhenge (English + Hindi mix)' : 'All concepts are in English mode.' }}
            </p>
          </div>

          <!-- Topic Stats -->
          <div class="glass-panel p-5 flex flex-col gap-3">
            <div class="text-[10px] font-bold uppercase tracking-widest mb-1"
                 style="color:rgba(0,212,255,0.5);">Topic Stats</div>
            <div class="grid grid-cols-2 gap-2">
              <div class="stat-mini-card" style="border-color:rgba(0,212,255,0.15)">
                <div class="text-lg font-black neon-text-cyan">{{ topic.sections.length }}</div>
                <div class="stat-label">Sections</div>
              </div>
              <div class="stat-mini-card" style="border-color:rgba(0,255,157,0.15)">
                <div class="text-lg font-black neon-text-green">{{ topic.quizQuestions.length }}</div>
                <div class="stat-label">Quiz Qs</div>
              </div>
              <div class="stat-mini-card" style="border-color:rgba(255,107,53,0.15)">
                <div class="text-lg font-black neon-text-orange">{{ topic.codeExamples.length }}</div>
                <div class="stat-label">Code Eg</div>
              </div>
              <div class="stat-mini-card" style="border-color:rgba(220,38,38,0.15)">
                <div class="text-lg font-black neon-text-red">{{ topic.interviewQuestions.length }}</div>
                <div class="stat-label">Interview Qs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div *ngIf="loading" class="flex-center flex-col gap-4 h-64 animate-fade-in">
      <div class="loader-ring-topic"></div>
      <div class="text-sm font-semibold" style="color:rgba(0,212,255,0.7);">
        Loading topic content…
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* ── Topic Header ── */
    .topic-header-card { border-left: none !important; position: relative; }
    .topic-left-accent {
      position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 3px 0 0 3px;
      background: linear-gradient(180deg, rgb(0,212,255), rgb(0,255,157), rgb(255,107,53), rgb(220,38,38), rgb(160,82,45));
      animation: gradient-shift 5s ease infinite;
      background-size: 100% 300%;
    }
    @keyframes gradient-shift {
      0%,100% { background-position: 0% 0%; }
      50%      { background-position: 0% 100%; }
    }

    /* ── Pathway Tabs ── */
    .pathway-tabs-row { gap: 6px; }
    .pathway-tab-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 30px;
      font-size: 0.78rem; font-weight: 600;
      background: rgba(0,212,255,0.04);
      border: 1px solid rgba(0,212,255,0.1);
      color: rgba(160,185,205,0.75);
      cursor: pointer; transition: all 0.3s ease;
      white-space: nowrap; font-family: 'Poppins', sans-serif;
    }
    .pathway-tab-btn:hover {
      border-color: rgba(0,212,255,0.3);
      color: rgb(200,220,238);
    }
    .pathway-tab-active {
      background: rgba(0,212,255,0.13) !important;
      border-color: rgb(0,212,255) !important;
      color: rgb(0,212,255) !important;
      box-shadow: 0 0 18px rgba(0,212,255,0.12);
    }
    .tab-icon { font-size: 0.85rem; }

    /* ── Section Cards ── */
    .section-card {
      padding: 16px; border-radius: 12px;
      background: rgba(0,212,255,0.025);
      border: 1px solid rgba(0,212,255,0.07);
      transition: border-color 0.3s ease, transform 0.3s ease;
      animation: fade-up 0.5s ease forwards;
      opacity: 0;
    }
    .section-card:hover {
      border-color: rgba(0,212,255,0.2);
      transform: translateX(3px);
    }
    @keyframes fade-up {
      from { opacity:0; transform: translateY(16px); }
      to   { opacity:1; transform: translateY(0); }
    }

    .section-number-badge {
      min-width: 28px; height: 28px; border-radius: 8px;
      background: rgba(0,212,255,0.1);
      border: 1px solid rgba(0,212,255,0.2);
      color: rgb(0,212,255); font-size: 0.7rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── Code Card ── */
    .code-card { animation: fade-up 0.5s ease forwards; opacity: 0; }
    .copy-code-btn {
      padding: 3px 10px; border-radius: 6px; font-size: 0.68rem;
      font-weight: 700; cursor: pointer;
      background: rgba(0,212,255,0.07);
      border: 1px solid rgba(0,212,255,0.2);
      color: rgba(0,212,255,0.8);
      font-family: 'Poppins', sans-serif; transition: all 0.25s ease;
    }
    .copy-code-btn:hover { background: rgba(0,212,255,0.16); border-color: rgb(0,212,255); }
    .copy-code-btn.copied { background: rgba(0,255,157,0.12); border-color: rgb(0,255,157); color: rgb(0,255,157); }

    /* ── Quiz ── */
    .quiz-question-block {
      border-bottom: 1px solid rgba(0,212,255,0.06);
      padding-bottom: 20px;
    }
    .quiz-question-block:last-child { border-bottom: none; padding-bottom: 0; }
    .quiz-q-num {
      display: inline-block; font-size: 0.7rem; font-weight: 800;
      color: rgb(0,212,255); margin-right: 8px;
      background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2);
      padding: 1px 7px; border-radius: 6px;
    }
    .opt-label {
      display: inline-block; font-weight: 800; margin-right: 8px;
      color: rgba(0,212,255,0.7);
    }
    .quiz-score-card {
      background: rgba(0,212,255,0.05);
      border: 1px solid rgba(0,212,255,0.15);
      border-radius: 12px;
    }

    /* ── Interview ── */
    .interview-card {
      padding: 16px; border-radius: 14px;
      background: rgba(0,212,255,0.03);
      border: 1px solid rgba(0,212,255,0.08);
      transition: border-color 0.3s ease;
    }
    .interview-card:hover { border-color: rgba(0,212,255,0.2); }
    .reveal-btn {
      padding: 6px 14px; border-radius: 8px; font-size: 0.72rem; font-weight: 600;
      background: rgba(0,212,255,0.07);
      border: 1px solid rgba(0,212,255,0.18);
      color: rgb(0,212,255); cursor: pointer; transition: all 0.25s ease;
      font-family: 'Poppins', sans-serif;
    }
    .reveal-btn:hover { background: rgba(0,212,255,0.15); box-shadow: 0 0 14px rgba(0,212,255,0.15); }

    /* ── Nav Buttons ── */
    .nav-topic-btn {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border-radius: 12px;
      background: rgba(0,212,255,0.04);
      border: 1px solid rgba(0,212,255,0.1);
      transition: all 0.3s ease; text-decoration: none;
    }
    .nav-topic-btn:hover { border-color: rgba(0,212,255,0.3); background: rgba(0,212,255,0.08); }
    .nav-next:hover { border-color: rgba(0,255,157,0.3); background: rgba(0,255,157,0.07); }
    .nav-arrow-icon {
      width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
      background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2);
      color: rgb(0,212,255); font-size: 0.9rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }
    .nav-arrow-green { background: rgba(0,255,157,0.1); border-color: rgba(0,255,157,0.2); color: rgb(0,255,157); }

    /* ── Complete Button ── */
    .complete-btn {
      width: 100%; padding: 11px; border-radius: 12px; font-weight: 700;
      font-size: 0.82rem; cursor: pointer; transition: all 0.4s ease;
      font-family: 'Poppins', sans-serif;
      background: rgba(0,212,255,0.07);
      border: 1.5px solid rgba(0,212,255,0.2);
      color: rgba(0,212,255,0.85);
    }
    .complete-btn:hover { background: rgba(0,212,255,0.15); border-color: rgb(0,212,255); box-shadow: 0 0 20px rgba(0,212,255,0.15); }
    .complete-btn.completed {
      background: rgba(0,255,157,0.12);
      border-color: rgb(0,255,157);
      color: rgb(0,255,157);
      box-shadow: 0 0 24px rgba(0,255,157,0.15);
    }

    /* ── Stat mini cards ── */
    .stat-mini-card {
      padding: 10px; border-radius: 10px;
      background: rgba(0,212,255,0.03);
      border: 1px solid;
      display: flex; flex-direction: column; align-items: center; gap: 2px;
    }
    .stat-label { font-size: 0.62rem; font-weight: 600; color: rgba(140,160,185,0.7); text-transform: uppercase; letter-spacing: 0.08em; }

    /* ── Loading ring ── */
    .loader-ring-topic {
      width: 48px; height: 48px; border-radius: 50%;
      border: 3px solid transparent;
      border-top: 3px solid rgb(0,212,255);
      border-right: 3px solid rgb(0,255,157);
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Difficulty badge colors ── */
    .badge-beginner-color { color: rgb(0,255,157); }
    .badge-intermediate-color { color: rgb(255,107,53); }
    .badge-advanced-color { color: rgb(220,38,38); }
  `]
})
export class TopicPage implements OnInit, OnDestroy {
  topic: TopicDetailResponse | null = null;
  loading = true;
  activePathway = 'foundations';
  isCompleted = false;
  copiedIdx: number | null = null;
  quizScore: number | null = null;

  quizAnswers: { [key: number]: number } = {};
  quizSubmitted: { [key: number]: boolean } = {};
  revealedAnswers: { [key: number]: boolean } = {};

  optLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Pagination
  currentPage = 1;
  readonly PAGE_SIZE = 5;

  pathways = [
    { id: 'foundations', name: 'Foundations', icon: '📘' },
    { id: 'deep-dive',   name: 'Deep Dive',   icon: '🔬' },
    { id: 'code-lab',    name: 'Code Lab',     icon: '💻' },
    { id: 'exam-prep',   name: 'Exam Prep',    icon: '📝' },
    { id: 'pro-tips',    name: 'Pro Tips',     icon: '🧠' },
  ];

  private routeSub!: Subscription;
  private sessionId = 'user-session-12345';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public hs: HinglishService
  ) {
    const saved = localStorage.getItem('springmastery_session');
    if (saved) this.sessionId = saved;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) this.loadTopic(slug);
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  private loadTopic(slug: string) {
    this.loading = true;
    this.topic = null;
    this.quizAnswers = {};
    this.quizSubmitted = {};
    this.revealedAnswers = {};
    this.quizScore = null;
    this.currentPage = 1;
    this.cdr.detectChanges();

    this.apiService.getTopicDetails(slug).subscribe({
      next: (data: TopicDetailResponse) => {
        this.topic = data;
        this.isCompleted = data.completionPercentage === 100;
        this.loading = false;
        this.cdr.detectChanges();
        this.apiService.updateProgress(slug, { sessionId: this.sessionId, status: 'IN_PROGRESS' }).subscribe();
      },
      error: (err: any) => {
        console.error('Failed to load topic', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  switchPathway(id: string) {
    this.activePathway = id;
    this.currentPage = 1;
  }

  // ── Pagination helpers ───────────────────────────────────────────
  getAllSections() {
    if (!this.topic) return [];
    if (this.activePathway === 'foundations')
      return this.topic.sections.filter(s => s.sectionNumber >= 1 && s.sectionNumber <= 25);
    if (this.activePathway === 'deep-dive')
      return this.topic.sections.filter(s => s.sectionNumber >= 26 && s.sectionNumber <= 50);
    return [];
  }

  get totalPages(): number {
    return Math.ceil(this.getAllSections().length / this.PAGE_SIZE) || 1;
  }

  pagedSections() {
    const all = this.getAllSections();
    const start = (this.currentPage - 1) * this.PAGE_SIZE;
    return all.slice(start, start + this.PAGE_SIZE);
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [];
    pages.push(1);
    if (this.currentPage > 3) pages.push(-1); // ellipsis
    for (let p = Math.max(2, this.currentPage - 1); p <= Math.min(total - 1, this.currentPage + 1); p++) {
      pages.push(p);
    }
    if (this.currentPage < total - 2) pages.push(-1);
    pages.push(total);
    return pages;
  }

  goPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  // ── Hinglish shortcut ─────────────────────────────────────────────
  hi(text: string | null | undefined): string {
    return this.hs.translate(text ?? '');
  }

  // ── Difficulty → color mapping ────────────────────────────────────
  difficultyColor(diff: string): string {
    const d = (diff || '').toLowerCase();
    if (d === 'beginner') return 'green';
    if (d === 'intermediate') return 'orange';
    if (d === 'advanced') return 'red';
    return 'cyan';
  }

  levelColor(lvl: string): string {
    const l = (lvl || '').toLowerCase();
    if (l === 'basic') return 'green';
    if (l === 'intermediate') return 'orange';
    if (l === 'advanced') return 'red';
    if (l === 'expert') return 'choco';
    return 'cyan';
  }

  // ── Quiz logic ────────────────────────────────────────────────────
  selectQuizAnswer(qi: number, oi: number) {
    if (this.quizSubmitted[qi]) return;
    this.quizAnswers[qi] = oi;
    this.quizSubmitted[qi] = true;

    if (this.topic) {
      const total = this.topic.quizQuestions.length;
      const done  = Object.keys(this.quizSubmitted).length;
      if (done === total && total > 0) {
        let correct = 0;
        this.topic.quizQuestions.forEach((q, idx) => {
          if (this.quizAnswers[idx] === q.correctAnswerIndex) correct++;
        });
        this.quizScore = (correct / total) * 100;
        this.apiService.updateProgress(this.topic.slug, {
          sessionId: this.sessionId, quizScore: this.quizScore
        }).subscribe();
      }
    }
    this.cdr.detectChanges();
  }

  // ── Mark complete ─────────────────────────────────────────────────
  completeTopic() {
    if (!this.topic) return;
    this.isCompleted = true;
    this.topic.completionPercentage = 100;
    this.apiService.updateProgress(this.topic.slug, {
      sessionId: this.sessionId, status: 'COMPLETED', sectionNumber: 69
    }).subscribe();
    this.cdr.detectChanges();
  }

  // ── Copy code ─────────────────────────────────────────────────────
  copyCode(code: string, idx: number) {
    navigator.clipboard.writeText(code).then(() => {
      this.copiedIdx = idx;
      this.cdr.detectChanges();
      setTimeout(() => { this.copiedIdx = null; this.cdr.detectChanges(); }, 2000);
    });
  }

  getPathwaySections() { return this.pagedSections(); }
}
