-- V14: Seed initial knowledge graph relationships/edges
INSERT INTO topic_relationships (from_topic_id, to_topic_id, relationship_type, description, weight) VALUES
-- Module 1 Core Prereqs
(1, 6, 'PREREQUISITE', 'What is Spring -> IOC (Inversion of Control)', 1),
(6, 7, 'PREREQUISITE', 'IOC -> IOC Container', 1),
(7, 8, 'PART_OF', 'IOC Container -> BeanFactory', 1),
(7, 9, 'PART_OF', 'IOC Container -> ApplicationContext', 1),
(6, 10, 'PREREQUISITE', 'IOC -> Dependency Injection', 1),
(10, 11, 'IMPLEMENTS', 'Dependency Injection -> Constructor Injection', 1),
(10, 12, 'IMPLEMENTS', 'Dependency Injection -> Setter Injection', 1),
(10, 13, 'IMPLEMENTS', 'Dependency Injection -> Field Injection', 1),
(14, 15, 'RELATED_TO', 'Spring Bean -> Bean Scope', 1),
(14, 16, 'RELATED_TO', 'Spring Bean -> Bean Lifecycle', 1),
(17, 14, 'PREREQUISITE', 'Component Scanning -> Spring Bean', 1),
(18, 19, 'DEPENDS_ON', 'Reflection -> Spring Container Internals', 1),

-- Module 2 (Spring Boot) and Module 1
(1, 20, 'PREREQUISITE', 'What is Spring -> What is Spring Boot?', 1),
(20, 21, 'RELATED_TO', 'What is Spring Boot -> Spring vs Spring Boot', 1),
(20, 23, 'PART_OF', 'What is Spring Boot -> Spring Boot Architecture', 1),
(23, 24, 'RELATED_TO', 'Spring Boot Architecture -> Startup Flow', 1),
(25, 26, 'DEPENDS_ON', '@SpringBootApplication -> Auto Configuration', 1),
(27, 26, 'DEPENDS_ON', 'Starter Dependencies -> Auto Configuration', 1),
(28, 23, 'PART_OF', 'Embedded Tomcat -> Spring Boot Architecture', 1),
(30, 31, 'ALTERNATIVE_TO', 'application.properties -> application.yml', 1),
(32, 23, 'PART_OF', 'Profiles -> Spring Boot Architecture', 1),
(33, 23, 'PART_OF', 'Spring Boot Actuator -> Spring Boot Architecture', 1),

-- Module 3 (Annotations) and Module 1/2
(36, 17, 'DEPENDS_ON', '@Component -> Component Scanning', 1),
(37, 36, 'EXTENDS', '@Service -> @Component', 1),
(38, 36, 'EXTENDS', '@Repository -> @Component', 1),
(39, 36, 'EXTENDS', '@Controller -> @Component', 1),
(40, 39, 'EXTENDS', '@RestController -> @Controller', 1),
(41, 10, 'DEPENDS_ON', '@Autowired -> Dependency Injection', 1),
(42, 43, 'COMPOSED_WITH', '@Configuration -> @Bean', 1),
(44, 45, 'RELATED_TO', '@Primary -> @Qualifier', 1),
(49, 50, 'EXTENDS', '@RequestMapping -> @GetMapping', 1),
(49, 51, 'EXTENDS', '@RequestMapping -> @PostMapping', 1),
(49, 52, 'EXTENDS', '@RequestMapping -> @PutMapping', 1),
(49, 53, 'EXTENDS', '@RequestMapping -> @DeleteMapping', 1),
(56, 57, 'RELATED_TO', '@RequestBody -> @ResponseBody', 1),
(59, 60, 'PART_OF', '@ExceptionHandler -> @ControllerAdvice', 1),
(60, 61, 'EXTENDS', '@ControllerAdvice -> @RestControllerAdvice', 1),

-- Module 4 (Microservices)
(62, 63, 'RELATED_TO', 'What are Microservices -> Why Microservices', 1),
(62, 64, 'RELATED_TO', 'What are Microservices -> Monolith vs Microservices', 1),
(65, 66, 'IMPLEMENTS', 'Service Discovery -> Eureka', 1),
(67, 68, 'DEPENDS_ON', 'API Gateway -> Load Balancer', 1),
(70, 71, 'IMPLEMENTS', 'Inter-Service Communication -> Feign Client', 1),
(70, 72, 'IMPLEMENTS', 'Inter-Service Communication -> RestTemplate', 1),
(70, 73, 'IMPLEMENTS', 'Inter-Service Communication -> WebClient', 1),
(74, 75, 'ALTERNATIVE_TO', 'Kafka -> RabbitMQ', 1),
(76, 77, 'PREREQUISITE', 'Docker Containers -> Kubernetes Orchestration', 1),
(79, 80, 'IMPLEMENTS', 'Distributed Transactions -> Saga Pattern', 1),
(81, 83, 'RELATED_TO', 'Centralized Logging -> Distributed Tracing', 1),

-- Module 5 (Collections)
(86, 90, 'IMPLEMENTS', 'List -> ArrayList', 1),
(86, 91, 'IMPLEMENTS', 'List -> LinkedList', 1),
(90, 91, 'ALTERNATIVE_TO', 'ArrayList -> LinkedList', 1),
(87, 94, 'IMPLEMENTS', 'Set -> HashSet', 1),
(87, 95, 'IMPLEMENTS', 'Set -> LinkedHashSet', 1),
(87, 96, 'IMPLEMENTS', 'Set -> TreeSet', 1),
(89, 98, 'IMPLEMENTS', 'Map -> HashMap', 1),
(89, 99, 'IMPLEMENTS', 'Map -> LinkedHashMap', 1),
(89, 100, 'IMPLEMENTS', 'Map -> TreeMap', 1),
(98, 101, 'ALTERNATIVE_TO', 'HashMap -> Hashtable', 1),
(98, 102, 'ALTERNATIVE_TO', 'HashMap -> ConcurrentHashMap', 1),
(103, 104, 'RELATED_TO', 'Fail-Fast -> Fail-Safe', 1),
(105, 106, 'RELATED_TO', 'Comparable -> Comparator', 1),
(98, 107, 'DEPENDS_ON', 'HashMap -> Hash Collision', 1),
(98, 108, 'DEPENDS_ON', 'HashMap -> Load Factor', 1),
(98, 109, 'DEPENDS_ON', 'HashMap -> Rehashing', 1),

-- Module 6 (Java 8+)
(112, 114, 'DEPENDS_ON', 'Lambda -> Functional Interfaces', 1),
(113, 112, 'DEPENDS_ON', 'Stream API -> Lambda', 1),
(112, 115, 'RELATED_TO', 'Lambda -> Method Reference', 1),
(113, 118, 'RELATED_TO', 'Stream API -> Parallel Streams', 1),
(119, 120, 'RELATED_TO', 'Java 17 Features -> Java 21 Features', 1),
(121, 120, 'PART_OF', 'Virtual Threads -> Java 21 Features', 1),

-- Module 7 (Multithreading)
(125, 126, 'PREREQUISITE', 'Process -> Thread', 1),
(126, 127, 'RELATED_TO', 'Thread -> Runnable', 1),
(126, 128, 'RELATED_TO', 'Thread -> Callable', 1),
(129, 130, 'DEPENDS_ON', 'Executor Framework -> Thread Pools', 1),
(131, 132, 'RELATED_TO', 'Synchronization -> Race Condition', 1),
(131, 133, 'RELATED_TO', 'Synchronization -> Deadlock', 1),
(134, 135, 'EXTENDS', 'Future -> CompletableFuture', 1),
(121, 136, 'DEPENDS_ON', 'Virtual Threads -> Virtual Threads Concurrency', 1),

-- Module 8 (SQL)
(137, 138, 'PART_OF', 'SQL Introduction -> SELECT', 1),
(137, 139, 'PART_OF', 'SQL Introduction -> INSERT', 1),
(137, 140, 'PART_OF', 'SQL Introduction -> UPDATE', 1),
(137, 141, 'PART_OF', 'SQL Introduction -> DELETE', 1),
(142, 143, 'RELATED_TO', 'CREATE TABLE -> ALTER TABLE', 1),
(144, 145, 'RELATED_TO', 'DROP TABLE -> TRUNCATE', 1),
(146, 147, 'RELATED_TO', 'Primary Key -> Foreign Key', 1),
(149, 150, 'IMPLEMENTS', 'Database Index -> Clustered Index', 1),
(149, 151, 'IMPLEMENTS', 'Database Index -> Non-Clustered Index', 1),
(153, 154, 'DEPENDS_ON', 'GROUP BY -> HAVING', 1),

-- Module 9 (JVM)
(161, 162, 'PART_OF', 'JVM Architecture -> Class Loader', 1),
(161, 163, 'PART_OF', 'JVM Architecture -> Execution Engine', 1),
(161, 164, 'PART_OF', 'JVM Architecture -> Memory Areas', 1),
(164, 165, 'PART_OF', 'Memory Areas -> Heap Memory', 1),
(164, 166, 'PART_OF', 'Memory Areas -> Stack Memory', 1),
(164, 167, 'PART_OF', 'Memory Areas -> Metaspace', 1),
(163, 170, 'PART_OF', 'Execution Engine -> JIT Compiler', 1),
(161, 171, 'PART_OF', 'JVM Architecture -> Garbage Collection', 1),
(171, 172, 'PART_OF', 'Garbage Collection -> Minor GC', 1),
(171, 173, 'PART_OF', 'Garbage Collection -> Major GC', 1),
(171, 174, 'IMPLEMENTS', 'Garbage Collection -> G1 GC', 1),
(171, 175, 'IMPLEMENTS', 'Garbage Collection -> ZGC', 1),

-- Module 10 (Core Java)
(176, 177, 'DEPENDS_ON', 'JDK -> JRE', 1),
(177, 178, 'DEPENDS_ON', 'JRE -> JVM Overview', 1),
(179, 180, 'RELATED_TO', 'String -> StringBuilder', 1),
(180, 181, 'ALTERNATIVE_TO', 'StringBuilder -> StringBuffer', 1),
(182, 183, 'RELATED_TO', 'equals() -> ==', 1),
(182, 184, 'DEPENDS_ON', 'equals() -> hashCode() contract', 1),
(185, 186, 'PART_OF', 'Exception Handling -> Checked Exception', 1),
(185, 187, 'PART_OF', 'Exception Handling -> Unchecked Exception', 1),
(188, 189, 'DEPENDS_ON', 'Serialization -> transient keyword', 1)
ON CONFLICT (id) DO NOTHING;

-- Adjust sequence for topic relationships ID
SELECT setval('topic_relationships_id_seq', (SELECT MAX(id) FROM topic_relationships));
