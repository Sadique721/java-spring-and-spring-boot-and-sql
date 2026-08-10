import { Routes } from '@angular/router';
import { AppShell } from './layout/app-shell';
import { Dashboard } from './features/dashboard/dashboard';
import { GraphViewer } from './features/graph/graph-viewer';
import { TopicPage } from './features/topic/topic-page';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'graph', component: GraphViewer },
      { path: 'topic/:slug', component: TopicPage }
    ]
  },
  { path: '**', redirectTo: '' }
];
