const fs = require('fs');
const path = require('path');

const dir = 'src/modules/reviewer/settings/components';
const files = ['AccountTab.tsx', 'AvailabilityTab.tsx'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace <input with <Input
  content = content.replace(/<input\b/g, '<Input');
  
  // Add import if not present
  if (!content.includes('import { Input }')) {
    content = content.replace('import React', 'import React\nimport { Input } from "@/components/ui/input";');
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
