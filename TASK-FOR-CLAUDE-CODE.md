You are the implementation engineer for "Spring Java Mastery — Deep Learning & Interview Intelligence Platform".

Infrastructure is ready:
- PostgreSQL: RUNNING at localhost:5432 (db: springmastery, user: springmastery, password: springmastery123)  
- pgAdmin: http://localhost:5050
- Java 25, Maven 3.9.12, Angular CLI 21, Node 24.12 all available
- Project root: D:\Projects\spring-java-mastery\
- pom.xml created, application.yml created, all directories created
- CLAUDE.md has full specification

READ the CLAUDE.md file first. Then implement all 18 phases:

PHASE 1: Create all JPA domain entities (Module, Topic, TopicSection, TopicRelationship, CodeExample, InterviewQuestion, QuizQuestion, RevisionNote, LearningProgress, SearchIndex, AuditRecord)
PHASE 2: Create Flyway migrations V1-V14 (schema + seed all 10 modules + 192 topics)
PHASE 3: Create repositories, services, controllers, DTOs, mappers, exception handlers
PHASE 4: Test backend - mvn clean compile, mvn test
PHASE 5: Create Angular project at D:\Projects\spring-java-mastery\frontend\
PHASE 6: Create all Angular components (AppShell, Header, Sidebar, TopicPage, GraphViewer, Quiz, etc.)
PHASE 7: Implement dark glassmorphism UI design (Poppins + Fira Code fonts, neon green/cyan/orange)
PHASE 8: Connect Angular to Spring Boot API
PHASE 9: Build knowledge graph visualizer
PHASE 10: Build quiz + interview engines
PHASE 11: Build progress + dashboard
PHASE 12: Populate content for all 192 topics (69 sections each)
PHASE 13: Run ng build, ng test
PHASE 14: Run full verification - all routes, all APIs, all content
PHASE 15: Fix any issues found
PHASE 16: Run final audit
PHASE 17: Generate VERIFICATION-REPORT.md
PHASE 18: Generate content-manifest.json

DO NOT STOP between phases.
DO NOT ask for confirmation for normal engineering steps.
Fix errors automatically and continue.
Use --dangerously-skip-permissions flag approach - you already have it.
