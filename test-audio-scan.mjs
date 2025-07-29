import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory containing the audio files
const audioBaseDir = path.join(__dirname, '..', '..', 'CA1 Sound Revision-20211101T202630Z-001', 'CA1 Sound Revision');

console.log('Looking for audio files in:', audioBaseDir);
console.log('Directory exists:', fs.existsSync(audioBaseDir));

if (fs.existsSync(audioBaseDir)) {
  const items = fs.readdirSync(audioBaseDir);
  console.log('Contents:', items);
} else {
  // Let's check what's in the parent directory
  const parentDir = path.join(__dirname, '..');
  console.log('Parent directory contents:', fs.readdirSync(parentDir));
  
  // Look for any directory containing "CA1" or "Sound"
  const parentItems = fs.readdirSync(parentDir);
  const audioRelated = parentItems.filter(item => 
    item.toLowerCase().includes('ca1') || 
    item.toLowerCase().includes('sound') ||
    item.toLowerCase().includes('revision')
  );
  console.log('Audio-related directories found:', audioRelated);
}
