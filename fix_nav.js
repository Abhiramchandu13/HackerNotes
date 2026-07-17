const fs = require('fs');
const path = require('path');

const networkingPath = path.join(__dirname, 'notes', 'networking');
const phases = [];

function toTitleCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Read directories
const dirs = fs.readdirSync(networkingPath).filter(f => fs.statSync(path.join(networkingPath, f)).isDirectory()).sort();

for (const dir of dirs) {
  const [num, ...nameParts] = dir.split('-');
  const phaseName = `${num} — ${toTitleCase(nameParts.join('-'))}`;
  
  const notes = [];
  const files = fs.readdirSync(path.join(networkingPath, dir)).filter(f => f.endsWith('.md')).sort();
  
  for (const file of files) {
    const id = `networking/${dir}/${file.replace('.md', '')}`;
    // Simple title extraction
    let title = toTitleCase(file.replace('.md', ''));
    
    // Read the actual file to get the # Title
    const content = fs.readFileSync(path.join(networkingPath, dir, file), 'utf8');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
    }

    notes.push({ id, title });
  }
  
  phases.push({ phase: phaseName, notes });
}

const networkingObj = {
  icon: "🌐",
  color: "#a2eeef",
  phases: phases
};

console.log(JSON.stringify(networkingObj, null, 4));
