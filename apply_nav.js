const fs = require('fs');
const path = require('path');

const navPath = path.join(__dirname, 'data', 'navigation.json');
let content = fs.readFileSync(navPath, 'utf8');

// The new networking block
const newNetworking = fs.readFileSync('new_networking_nav.json', 'utf8');

// Find the start of the Networking block
const startIndex = content.indexOf('"Networking": {');
if (startIndex === -1) {
    console.error("Could not find Networking block");
    process.exit(1);
}

// Find the end of the Networking block. It ends right before "Cloud Security" or "Active Directory" 
// Actually, let's use a regex or string manipulation carefully.
// The structure is:
//   "Networking": { ... },
//   "Reverse Engineering": { ... }  <-- Wait, it's at the end or near the end.

// Let's parse the file manually. It's a JS file exporting a const.
// It looks like:
// const NAV = {
//   "Category": { ... },
//   "Networking": { ... }
// };

// I will use string replacement.
// Find the exact block.
// Since it's standard JSON formatting inside a JS file:
const lines = content.split('\n');
let startLine = -1;
let endLine = -1;
let braceCount = 0;
let inNetworking = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('"Networking": {')) {
        startLine = i;
        inNetworking = true;
    }
    
    if (inNetworking) {
        if (lines[i].includes('{')) braceCount += (lines[i].match(/\{/g) || []).length;
        if (lines[i].includes('}')) braceCount -= (lines[i].match(/\}/g) || []).length;
        
        if (braceCount === 0 && i > startLine) {
            endLine = i;
            break;
        }
    }
}

if (startLine !== -1 && endLine !== -1) {
    const oldBlock = lines.slice(startLine, endLine + 1).join('\n');
    
    // Indent the new block correctly
    const indentedNewNetworking = newNetworking.split('\n').map((line, idx) => {
        if (idx === 0) return `  "Networking": {`;
        return `  ${line}`;
    }).join('\n');

    content = content.replace(oldBlock, indentedNewNetworking);
    fs.writeFileSync(navPath, content, 'utf8');
    console.log("Successfully replaced Networking block.");
} else {
    console.error("Failed to parse blocks.");
}
