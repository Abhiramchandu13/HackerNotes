const fs = require('fs');
let content = fs.readFileSync('data/navigation.json', 'utf8');

// Let's remove the first "Reverse Engineering" block since it's duplicated.
// The first one is at line 802:
//   "Reverse Engineering": { ... },
//   "Networking": { ... }
// We can just keep the second one at the end of NAV, and make sure CAT_FOLDER has it.

// Let's check the position of "Reverse Engineering"
const firstIndex = content.indexOf('"Reverse Engineering": {');
const lastIndex = content.lastIndexOf('"Reverse Engineering": {');

if (firstIndex !== lastIndex && firstIndex !== -1) {
    // Find the end of the first "Reverse Engineering" block (line 816)
    // It's followed by "Networking": {
    const netIndex = content.indexOf('"Networking": {');
    const partToReplace = content.substring(firstIndex, netIndex);
    content = content.replace(partToReplace, '');
}

// Ensure "Reverse Engineering" is in CAT_FOLDER
if (!content.includes('"Reverse Engineering": "reverse-engineering"')) {
    content = content.replace('"Networking":        "networking"', '"Reverse Engineering": "reverse-engineering",\n  "Networking":        "networking"');
}

fs.writeFileSync('data/navigation.json', content, 'utf8');
console.log("Cleaned up navigation.json");
