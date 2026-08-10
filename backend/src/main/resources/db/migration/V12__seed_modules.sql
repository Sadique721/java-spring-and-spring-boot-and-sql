-- V12: Seed all 10 modules
INSERT INTO modules (id, slug, title, description, icon_name, display_order, total_topics, is_active) VALUES
(1, 'spring-framework-fundamentals', 'Spring Framework Fundamentals', 'Master the core concepts of Spring including IOC, Dependency Injection, Bean Lifecycles, and ApplicationContext.', 'layers', 1, 19, true),
(2, 'spring-boot', 'Spring Boot Essentials', 'Learn Spring Boot startup flow, auto-configuration, starters, embedded servers, profiles, and actuators.', 'flash', 2, 16, true),
(3, 'spring-boot-annotations', 'Spring Boot Annotations', 'Deep dive into every essential Spring Boot annotation, their internal workings, and real-world usage.', 'code', 3, 26, true),
(4, 'microservices', 'Microservices Architecture', 'Build resilient microservices with Eureka, Feign, WebClient, Kafka, API Gateway, Docker, and Kubernetes.', 'git-branch', 4, 24, true),
(5, 'java-collections', 'Java Collections Framework', 'Master lists, sets, maps, concurrent collections, time complexity, and internal collection mechanics.', 'list', 5, 26, true),
(6, 'java-new-features', 'Java 8, 17, and 21 Features', 'Learn Lambdas, Streams, Virtual Threads, Pattern Matching, Sequenced Collections, and Records.', 'zap', 6, 13, true),
(7, 'multithreading-concurrency', 'Multithreading and Concurrency', 'Deep dive into threads, execution frameworks, synchronization, deadlock, and CompletableFuture.', 'activity', 7, 12, true),
(8, 'sql-database', 'SQL and Databases', 'Master constraints, indexes, joins, ACID transactions, normalization, and database internals.', 'database', 8, 24, true),
(9, 'jvm-internals', 'JVM Architecture & Garbage Collection', 'Learn JVM memory areas, class loaders, JIT compiler, and garbage collection algorithms (G1, ZGC).', 'cpu', 9, 15, true),
(10, 'core-java', 'Core Java Concepts', 'Master serialization, exception handling, string manipulation, equals/hashCode contracts, and keywords.', 'terminal', 10, 17, true)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name,
    display_order = EXCLUDED.display_order,
    total_topics = EXCLUDED.total_topics;

-- Adjust sequence for modules ID
SELECT setval('modules_id_seq', (SELECT MAX(id) FROM modules));
