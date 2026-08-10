import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ModuleResponse {
  id: number;
  slug: string;
  title: string;
  description: string;
  iconName: string;
  displayOrder: number;
  totalTopics: number;
  isActive: boolean;
}

export interface TopicResponse {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  moduleId: number;
  moduleTitle: string;
  difficulty: string;
  estimatedMinutes: number;
  displayOrder: number;
  contentStatus: string;
  completionPercentage: number;
}

export interface SectionResponse {
  id: number;
  sectionNumber: number;
  sectionTitle: string;
  content: string;
  contentType: string;
  isApplicable: boolean;
}

export interface CodeExampleResponse {
  id: number;
  level: string;
  title: string;
  code: string;
  language: string;
  explanation: string;
}

export interface InterviewQuestionResponse {
  id: number;
  difficulty: string;
  question: string;
  answer: string;
  followUpQuestions: string[];
  interviewTip: string;
  category: string;
}

export interface QuizQuestionResponse {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: string;
}

export interface RevisionNoteResponse {
  id: number;
  content: string;
  keyPoints: string[];
  memoryTricks: string[];
}

export interface RelationshipResponse {
  id: number;
  fromTopicId: number;
  fromTopicTitle: string;
  fromTopicSlug: string;
  toTopicId: number;
  toTopicTitle: string;
  toTopicSlug: string;
  relationshipType: string;
  description: string;
  weight: number;
}

export interface TopicDetailResponse {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  moduleId: number;
  moduleSlug: string;
  moduleTitle: string;
  difficulty: string;
  estimatedMinutes: number;
  displayOrder: number;
  contentStatus: string;
  completionPercentage: number;
  sections: SectionResponse[];
  codeExamples: CodeExampleResponse[];
  interviewQuestions: InterviewQuestionResponse[];
  quizQuestions: QuizQuestionResponse[];
  revisionNotes: RevisionNoteResponse;
  relationships: RelationshipResponse[];
  prerequisites: TopicResponse[];
  previousTopic: TopicResponse | null;
  nextTopic: TopicResponse | null;
}

export interface GraphNode {
  id: string;
  label: string;
  module: string;
  difficulty: string;
  val: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface DashboardStatsResponse {
  totalModules: number;
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  overallCompletionPercentage: number;
  averageQuizScore: number;
  weakTopics: TopicResponse[];
  recommendedTopics: TopicResponse[];
}

export interface ProgressRequest {
  sessionId: string;
  sectionNumber?: number;
  quizScore?: number;
  status?: string;
}

export interface ProgressResponse {
  id: number;
  sessionId: string;
  topicId: number;
  topicSlug: string;
  topicTitle: string;
  status: string;
  sectionsCompleted: number;
  quizScore: number;
  lastAccessed: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  // Modules
  getModules(): Observable<ModuleResponse[]> {
    return this.http.get<ModuleResponse[]>(`${this.baseUrl}/modules`);
  }

  getModule(slug: string): Observable<ModuleResponse> {
    return this.http.get<ModuleResponse>(`${this.baseUrl}/modules/${slug}`);
  }

  getModuleTopics(slug: string): Observable<TopicResponse[]> {
    return this.http.get<TopicResponse[]>(`${this.baseUrl}/modules/${slug}/topics`);
  }

  // Topics
  getTopics(): Observable<TopicResponse[]> {
    return this.http.get<TopicResponse[]>(`${this.baseUrl}/topics`);
  }

  getTopicDetails(slug: string): Observable<TopicDetailResponse> {
    return this.http.get<TopicDetailResponse>(`${this.baseUrl}/topics/${slug}`);
  }

  // Knowledge Graph
  getFullGraph(): Observable<GraphData> {
    return this.http.get<GraphData>(`${this.baseUrl}/graph`);
  }

  getTopicSubGraph(slug: string): Observable<GraphData> {
    return this.http.get<GraphData>(`${this.baseUrl}/graph/topic/${slug}`);
  }

  // Search
  search(query: string): Observable<TopicResponse[]> {
    return this.http.get<TopicResponse[]>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
  }

  // Progress Tracking
  updateProgress(topicSlug: string, request: ProgressRequest): Observable<ProgressResponse> {
    return this.http.post<ProgressResponse>(`${this.baseUrl}/progress/${topicSlug}`, request);
  }

  getSessionProgress(sessionId: string): Observable<ProgressResponse[]> {
    return this.http.get<ProgressResponse[]>(`${this.baseUrl}/progress/session/${sessionId}`);
  }

  getDashboardStats(sessionId: string): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(`${this.baseUrl}/progress/dashboard/${sessionId}`);
  }
}
