const fs = require('fs');
let content = fs.readFileSync('data/navigation.json', 'utf8');

// The block ends with `  }\n  \n\n  "Reverse Engineering": {` or similar.
// Let's just find `  }\n\n  "Reverse Engineering": {` or `  }\n  \n  "Reverse Engineering": {`
content = content.replace(/ {2}\}\n\n {2}"Reverse Engineering": \{/, '  },\n\n  "Reverse Engineering": {');
content = content.replace(/ {2}\}\n  \n {2}"Reverse Engineering": \{/, '  },\n\n  "Reverse Engineering": {');
content = content.replace(/ {2}\}\n\s+"Reverse Engineering": \{/, '  },\n\n  "Reverse Engineering": {');

fs.writeFileSync('data/navigation.json', content, 'utf8');
