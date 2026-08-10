const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../backend/src/main/resources/static/browser');
const destDir = path.join(__dirname, '../backend/src/main/resources/static');

function moveFolder(src, dest) {
    if (!fs.existsSync(src)) {
        console.log(`Source folder does not exist: ${src}`);
        return;
    }
    
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        
        if (fs.statSync(srcFile).isDirectory()) {
            moveFolder(srcFile, destFile);
        } else {
            fs.renameSync(srcFile, destFile);
        }
    });
    
    // Clean up empty source directory
    try {
        fs.rmdirSync(src);
    } catch (e) {
        // Ignore if not empty
    }
}

console.log("Moving Angular assets from browser/ to root static/...");
moveFolder(srcDir, destDir);
console.log("Assets moved successfully! ✅");
process.exit(0);
