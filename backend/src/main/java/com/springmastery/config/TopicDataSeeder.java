package com.springmastery.config;

import com.springmastery.domain.*;
import com.springmastery.domain.Module;
import com.springmastery.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TopicDataSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final TopicSectionRepository sectionRepository;
    private final CodeExampleRepository codeExampleRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final RevisionNoteRepository revisionNoteRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Checking database content status...");
        long sectionCount = sectionRepository.count();
        if (sectionCount > 0) {
            log.info("Database content is already seeded. (Found {} sections)", sectionCount);
            return;
        }

        log.info("Starting topic data seeding loop for 192 topics...");
        List<Topic> topics = topicRepository.findAll();
        
        int count = 0;
        for (Topic topic : topics) {
            seedTopicContent(topic);
            count++;
            if (count % 20 == 0) {
                log.info("Seeded content for {} / {} topics...", count, topics.size());
            }
        }
        
        log.info("Seeding completed successfully! Total sections created: {}", sectionRepository.count());
    }

    private void seedTopicContent(Topic topic) {
        // 1. Seed 69 Sections
        List<TopicSection> sections = new ArrayList<>();
        for (int i = 1; i <= 69; i++) {
            String pathway = getPathwayName(i);
            String title = getSectionTitle(i);
            String content = generateDetailedContent(topic, i, pathway, title);
            
            sections.add(TopicSection.builder()
                    .topic(topic)
                    .sectionNumber(i)
                    .sectionTitle(title)
                    .content(content)
                    .contentType(TopicSection.ContentType.MARKDOWN)
                    .isApplicable(true)
                    .build());
        }
        sectionRepository.saveAll(sections);

        // 2. Seed Code Examples
        codeExampleRepository.save(CodeExample.builder()
                .topic(topic)
                .level(CodeExample.Level.BASIC)
                .title("Standard Implementation of " + topic.getTitle())
                .code(generateBasicCode(topic))
                .language("java")
                .explanation("This demonstrates the clean, basic setup of " + topic.getTitle() + " following best practices.")
                .displayOrder(1)
                .build());

        codeExampleRepository.save(CodeExample.builder()
                .topic(topic)
                .level(CodeExample.Level.PRODUCTION)
                .title("Production-Ready Configuration for " + topic.getTitle())
                .code(generateProductionCode(topic))
                .language("java")
                .explanation("This shows the production-grade, thread-safe, and highly optimized setup of " + topic.getTitle() + ".")
                .displayOrder(2)
                .build());

        // 3. Seed Interview Questions
        interviewQuestionRepository.save(InterviewQuestion.builder()
                .topic(topic)
                .difficulty(InterviewQuestion.Difficulty.INTERMEDIATE)
                .question("Explain the core concept of " + topic.getTitle() + " and how it works in a Spring project.")
                .answer("Under the hood, " + topic.getTitle() + " acts as a central mechanism to solve domain challenges. For example, " + topic.getSubtitle() + ". It is configured via metadata annotations or Java config classes, enabling clean inversion of control and dependency resolution.")
                .followUpQuestions(Arrays.asList(
                        "What are the common pitfalls when configuring " + topic.getTitle() + "?",
                        "How does the JVM handle thread visibility for " + topic.getTitle() + "?"
                ))
                .interviewTip("Always mention real-world production configurations and memory impacts when answering this question.")
                .category(InterviewQuestion.Category.CONCEPTUAL)
                .displayOrder(1)
                .build());

        // 4. Seed Quiz Questions
        quizQuestionRepository.save(QuizQuestion.builder()
                .topic(topic)
                .question("Which of the following best describes the primary purpose of " + topic.getTitle() + "?")
                .options(Arrays.asList(
                        "To manage configuration and runtime dependencies cleanly",
                        "To bypass Java memory management systems",
                        "To compile bytecode into machine instructions",
                        "To establish direct database network channels"
                ))
                .correctAnswerIndex(0)
                .explanation("The primary purpose of " + topic.getTitle() + " is " + topic.getSubtitle() + ", allowing developers to write decoupled and testable code.")
                .difficulty(QuizQuestion.Difficulty.INTERMEDIATE)
                .displayOrder(1)
                .build());

        // 5. Seed Revision Note
        revisionNoteRepository.save(RevisionNote.builder()
                .topic(topic)
                .content("Quick summary of " + topic.getTitle() + ": " + topic.getSubtitle() + ". Essential for clean enterprise design.")
                .keyPoints(Arrays.asList(
                        "Standard initialization via IOC lifecycle callbacks.",
                        "Configured using Spring stereotype annotations.",
                        "Garbage collection safety through proper resource closing."
                ))
                .memoryTricks(Arrays.asList(
                        "Mnemonic: S-P-R-I-N-G (Singletons, Prototypes, Repositories, Inversion of control, Normalization, Graphs)"
                ))
                .build());
    }

    private String getPathwayName(int sectionNumber) {
        if (sectionNumber <= 25) return "Pathway 1: Foundations";
        if (sectionNumber <= 50) return "Pathway 2: Deep Dive";
        if (sectionNumber <= 60) return "Pathway 3: Code Lab";
        if (sectionNumber <= 65) return "Pathway 4: Exam Prep";
        return "Pathway 5: Pro Tips";
    }

    private String getSectionTitle(int sectionNumber) {
        return switch (sectionNumber) {
            case 1 -> "Conceptual Introduction";
            case 2 -> "Historical Background and Evolution";
            case 3 -> "Primary Problem Solved";
            case 4 -> "Architectural Blueprint";
            case 5 -> "Memory Allocation Mechanisms";
            case 6 -> "Core Lifecycle Phases";
            case 7 -> "Thread Safety Context";
            case 8 -> "Design Patterns Utilized";
            case 9 -> "Garbage Collection Implications";
            case 10 -> "Configuration Parameters Overview";
            case 11 -> "Standard Defaults";
            case 12 -> "Common Customizations";
            case 13 -> "Alternative Approaches";
            case 14 -> "Framework Adaptability";
            case 15 -> "Dependency Tree Location";
            case 16 -> "Standard API Interface Contracts";
            case 17 -> "Underlying Algorithm Specs";
            case 18 -> "Time Complexity Bounds";
            case 19 -> "Space Complexity Bounds";
            case 20 -> "JVM Level Optimizations";
            case 21 -> "Spring Container Lifecycle Hookpoints";
            case 22 -> "Autoconfiguration Triggers";
            case 23 -> "Conditional Load Policies";
            case 24 -> "Proxy Mechanics (JDK vs CGLIB)";
            case 25 -> "Diagnostic Actuator Mappings";
            case 26 -> "Bytecode Instrumentation Details";
            case 27 -> "Reflection Overhead Reductions";
            case 28 -> "Bootstrap Initializer Pipeline";
            case 29 -> "Context Refresh Events Handling";
            case 30 -> "BeanPostProcessor Registration Flow";
            case 31 -> "BeanFactoryPostProcessor Interceptions";
            case 32 -> "Dynamic Classloading Restrictions";
            case 33 -> "AOP Joinpoint Advisor Chains";
            case 34 -> "Transaction Propagation Internals";
            case 35 -> "Isolation Levels Verification";
            case 36 -> "Locking Strategies (Optimistic/Pesimistic)";
            case 37 -> "Connection Pool Allocation Flow";
            case 38 -> "Statement Caching Levels";
            case 39 -> "Serialization Protocols Details";
            case 40 -> "Custom Classloaders Loading";
            case 41 -> "Off-Heap Storage Handlers";
            case 42 -> "GraalVM Native Image Reflections";
            case 43 -> "Build-time Class Metadata Compaction";
            case 44 -> "Virtual Threads Pinning Protections";
            case 45 -> "Carrier Threads Relinquish Triggers";
            case 46 -> "Lock Contention Profiles";
            case 47 -> "Memory Barrier CPU Instructions";
            case 48 -> "CPU Cache Line Padding Tricks";
            case 49 -> "JIT Compiler Inlining Budgets";
            case 50 -> "Tiered Compilation Escape Analysis";
            case 51 -> "Standard Local Execution Configurations";
            case 52 -> "Docker Container Resource Allocations";
            case 53 -> "Kubernetes Readiness Probes Configurations";
            default -> "Advanced Production Specifications and Optimizations (Section " + sectionNumber + ")";
        };
    }

    private String generateDetailedContent(Topic topic, int secNum, String pathway, String secTitle) {
        return "Detailed educational content for " + topic.getTitle() + " under " + pathway + " (" + secTitle + ").\n\n" +
                "In enterprise Spring and Java systems, " + topic.getTitle() + " represents a key architectural building block designed to address " + topic.getSubtitle().toLowerCase() + ".\n\n" +
                "Key technical concepts include:\n" +
                "1. Structural alignment with JVM Metaspace and Heap bounds.\n" +
                "2. Dynamic dependency resolution using standard Spring annotations.\n" +
                "3. Concurrency protection via thread local storage and non-blocking locking.\n\n" +
                "When implementing this in production, developers must carefully evaluate time complexity, class metadata overhead, and standard connection bounds.";
    }

    private String generateBasicCode(Topic topic) {
        return "package com.springmastery.example;\n\n" +
                "import org.springframework.stereotype.Component;\n\n" +
                "@Component\n" +
                "public class Basic" + cleanName(topic.getTitle()) + " {\n" +
                "    // Basic implementation representing: " + topic.getTitle() + "\n" +
                "    public String process() {\n" +
                "        return \"Processing details for " + topic.getTitle() + "\";\n" +
                "    }\n" +
                "}";
    }

    private String generateProductionCode(Topic topic) {
        return "package com.springmastery.example;\n\n" +
                "import org.springframework.stereotype.Service;\n" +
                "import org.springframework.transaction.annotation.Transactional;\n" +
                "import java.util.concurrent.ConcurrentHashMap;\n" +
                "import lombok.extern.slf4j.Slf4j;\n\n" +
                "@Service\n" +
                "@Slf4j\n" +
                "public class Production" + cleanName(topic.getTitle()) + "Service {\n\n" +
                "    private final ConcurrentHashMap<String, String> cache = new ConcurrentHashMap<>();\n\n" +
                "    @Transactional(readOnly = true)\n" +
                "    public String executeWithCaching(String key) {\n" +
                "        log.info(\"Executing thread-safe operation for: {}\", key);\n" +
                "        return cache.computeIfAbsent(key, k -> {\n" +
                "            // Highly optimized production lookup mapping to: " + topic.getTitle() + "\n" +
                "            return \"Production Result: \" + k;\n" +
                "        });\n" +
                "    }\n" +
                "}";
    }

    private String cleanName(String title) {
        return title.replaceAll("[^a-zA-Z0-9]", "");
    }
}
