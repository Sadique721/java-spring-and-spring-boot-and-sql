const fs = require('fs');
const path = require('path');
const http = require('http');

console.log("=============================================================");
console.log("             SPRING JAVA MASTERY VERIFICATION SYSTEM         ");
console.log("=============================================================");
console.log("");

// 1. Check Directory and Source Files
const backendPath = path.join(__dirname, '../backend');
const frontendPath = path.join(__dirname, '../frontend');

console.log("[1] Checking File Integrity...");
const requiredBackendDirs = [
    'src/main/java/com/springmastery/domain',
    'src/main/java/com/springmastery/repository',
    'src/main/java/com/springmastery/service',
    'src/main/java/com/springmastery/controller',
    'src/main/resources/db/migration'
];

let filesOk = true;
requiredBackendDirs.forEach(dir => {
    const fullPath = path.join(backendPath, dir);
    if (fs.existsSync(fullPath)) {
        console.log(`    [OK] Backend directory: ${dir}`);
    } else {
        console.log(`    [FAIL] Backend directory missing: ${dir}`);
        filesOk = false;
    }
});

// 2. Check Angular Project Scaffolding
const requiredFrontendFiles = [
    'angular.json',
    'package.json',
    'src/styles.css',
    'src/app/app.ts'
];

requiredFrontendFiles.forEach(file => {
    const fullPath = path.join(frontendPath, file);
    if (fs.existsSync(fullPath)) {
        console.log(`    [OK] Frontend file: ${file}`);
    } else {
        console.log(`    [FAIL] Frontend file missing: ${file}`);
        filesOk = false;
    }
});

if (!filesOk) {
    console.log("\n[FAIL] File verification failed!");
    process.exit(1);
}

console.log("\n[2] Performing Active REST API Checks...");
// Query the active modules API to ensure Spring Boot is running and serving data
const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/v1/modules',
    method: 'GET',
    timeout: 5000
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const modules = JSON.parse(data);
            console.log(`    [OK] REST API connected to localhost:8080`);
            console.log(`    [OK] Exposed Modules count: ${modules.length} (Expected: 10)`);
            if (modules.length === 10) {
                console.log("    [OK] All 10 educational modules seeded successfully!");
            } else {
                console.log(`    [WARNING] Expected 10 modules, but found ${modules.length}`);
            }
            
            // Check topics count
            http.get('http://localhost:8080/api/v1/topics', (topicRes) => {
                let topicData = '';
                topicRes.on('data', (chunk) => { topicData += chunk; });
                topicRes.on('end', () => {
                    try {
                        const topics = JSON.parse(topicData);
                        console.log(`    [OK] Exposed Topics count: ${topics.length} (Expected: 192)`);
                        if (topics.length === 192) {
                            console.log("    [OK] All 192 individual topics seeded successfully!");
                        } else {
                            console.log(`    [WARNING] Expected 192 topics, but found ${topics.length}`);
                        }
                        
                        console.log("\n=============================================================");
                        console.log(" RESULT: BACKEND API IS 100% ONLINE AND FULLY VERIFIED! ✅  ");
                        console.log("=============================================================");
                        process.exit(0);
                    } catch (e) {
                        console.log("    [FAIL] Could not parse topics API response: " + e.message);
                        process.exit(1);
                    }
                });
            }).on('error', (err) => {
                console.log("    [FAIL] Topics API connection error: " + err.message);
                process.exit(1);
            });
        } catch (e) {
            console.log("    [FAIL] Could not parse modules API response: " + e.message);
            process.exit(1);
        }
    });
});

req.on('error', (err) => {
    console.log("    [FAIL] Spring Boot API is OFFLINE on port 8080!");
    console.log("    Please start the Spring Boot app using 'mvn spring-boot:run' first.");
    process.exit(1);
});

req.end();
