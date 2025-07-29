import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://lbehbtrbaamfjozwfizy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZWhidHJiYWFtZmpvendmaXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzcxMzMsImV4cCI6MjA2OTM1MzEzM30.enjLqzvhZoondvjT-IxuTvZ9adzW4WosaSugIspY05U';
const supabase = createClient(supabaseUrl, supabaseKey);

// Base directory containing the audio files - they are in the same directory as the script
const audioBaseDir = path.join(__dirname, 'CA1 Sound Revision-20211101T202630Z-001', 'CA1 Sound Revision');

// Function to get all audio files recursively
function getAudioFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAudioFiles(fullPath, baseDir));
    } else if (stat.isFile() && /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(item)) {
      // Get relative path from base directory
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        localPath: fullPath,
        storagePath: relativePath.replace(/\\/g, '/'), // Convert Windows paths to forward slashes
        fileName: item,
        size: stat.size
      });
    }
  }
  
  return files;
}

// Function to upload a single file
async function uploadFile(file) {
  try {
    console.log(`Uploading: ${file.storagePath}`);
    
    const fileBuffer = fs.readFileSync(file.localPath);
    
    const { data, error } = await supabase.storage
      .from('ca1-audio-files')
      .upload(file.storagePath, fileBuffer, {
        contentType: 'audio/mpeg',
        upsert: true // Overwrite if exists
      });
    
    if (error) {
      console.error(`Error uploading ${file.storagePath}:`, error);
      return { success: false, error, file };
    }
    
    console.log(`✅ Successfully uploaded: ${file.storagePath}`);
    return { success: true, data, file };
    
  } catch (err) {
    console.error(`Exception uploading ${file.storagePath}:`, err);
    return { success: false, error: err, file };
  }
}

// Function to get public URL for uploaded files
async function getPublicUrl(storagePath) {
  const { data } = supabase.storage
    .from('ca1-audio-files')
    .getPublicUrl(storagePath);
  
  return data.publicUrl;
}

// Main upload function
async function uploadAllFiles() {
  try {
    console.log('🔍 Scanning for audio files...');
    const audioFiles = getAudioFiles(audioBaseDir);
    
    console.log(`📁 Found ${audioFiles.length} audio files to upload`);
    
    const results = {
      successful: [],
      failed: [],
      urls: {}
    };
    
    // Upload files in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < audioFiles.length; i += batchSize) {
      const batch = audioFiles.slice(i, i + batchSize);
      console.log(`\n📤 Uploading batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(audioFiles.length/batchSize)}`);
      
      const batchPromises = batch.map(file => uploadFile(file));
      const batchResults = await Promise.all(batchPromises);
      
      for (const result of batchResults) {
        if (result.success) {
          results.successful.push(result.file);
          // Get public URL
          const publicUrl = await getPublicUrl(result.file.storagePath);
          results.urls[result.file.storagePath] = publicUrl;
        } else {
          results.failed.push(result);
        }
      }
      
      // Small delay between batches
      if (i + batchSize < audioFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('\n📊 Upload Summary:');
    console.log(`✅ Successful: ${results.successful.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    
    if (results.failed.length > 0) {
      console.log('\n❌ Failed uploads:');
      results.failed.forEach(result => {
        console.log(`  - ${result.file.storagePath}: ${result.error.message}`);
      });
    }
    
    // Save the results to a JSON file
    const outputFile = path.join(__dirname, 'upload-results.json');
    fs.writeFileSync(outputFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total: audioFiles.length,
        successful: results.successful.length,
        failed: results.failed.length
      },
      files: results.successful.map(file => ({
        localPath: file.localPath,
        storagePath: file.storagePath,
        publicUrl: results.urls[file.storagePath],
        fileName: file.fileName,
        size: file.size
      })),
      failed: results.failed.map(result => ({
        file: result.file,
        error: result.error.message
      }))
    }, null, 2));
    
    console.log(`\n💾 Results saved to: ${outputFile}`);
    console.log('\n🎉 Upload process completed!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Fatal error during upload process:', error);
    throw error;
  }
}

// Run the upload if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  uploadAllFiles()
    .then(() => {
      console.log('Upload process finished successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Upload process failed:', error);
      process.exit(1);
    });
}

export { uploadAllFiles, getAudioFiles, getPublicUrl };
