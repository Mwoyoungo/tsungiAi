# Supabase Project Setup - Actuary Audio Storage

## Project Information
- **Project Name**: Actuary Audio Storage
- **Project ID**: `lbehbtrbaamfjozwfizy`
- **Organization**: newlockqwerty's Org (`gkickfnedkavmgznuwzp`)
- **Region**: us-east-1
- **Status**: ACTIVE_HEALTHY
- **Created**: 2025-07-29T08:18:53.060374Z
- **Cost**: $0/month (Free tier)

## Project URLs
- **API URL**: https://lbehbtrbaamfjozwfizy.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/lbehbtrbaamfjozwfizy

## Authentication
- **Anonymous Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZWhidHJiYWFtZmpvendmaXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzcxMzMsImV4cCI6MjA2OTM1MzEzM30.enjLqzvhZoondvjT-IxuTvZ9adzW4WosaSugIspY05U`

## Storage Configuration

### Bucket: `ca1-audio-files`
- **Purpose**: Store CA1 Sound Revision audio files
- **Public Access**: Enabled (true)
- **File Size Limit**: 50MB per file (52,428,800 bytes)
- **Allowed MIME Types**:
  - `audio/mpeg`
  - `audio/mp3`
  - `audio/wav`
  - `audio/ogg`
  - `audio/m4a`
  - `audio/aac`
  - `audio/flac`

## Audio Files Structure

### Source Directory
```
CA1 Sound Revision-20211101T202630Z-001/
└── CA1 Sound Revision/
    ├── Disk 1 (Part 1- Part 2)/
    │   ├── 01 Introduction.mp3
    │   ├── 02 Professionalism.mp3
    │   ├── 03 Stakeholders.mp3
    │   ├── 04 External Environment.mp3
    │   ├── 05 Regulation.mp3
    │   ├── 06 Financial Products.mp3
    │   ├── 07 Providers of Benefits.mp3
    │   ├── 08 Life Products.mp3
    │   ├── 09 General Insurance Products.mp3
    │   ├── 10 Cashflows.mp3
    │   └── 11 Contract Design.mp3
    ├── Disk 2/
    │   ├── 12 Project Management.mp3
    │   ├── 13 Capital Project Appraisal.mp3
    │   ├── 14 Money Markets.mp3
    │   ├── 15 Bond Markets.mp3
    │   ├── 16 Equity Markets.mp3
    │   ├── 17 Property Markets.mp3
    │   ├── 18 Futures _ Options.mp3
    │   ├── 19 Collective Investment Scheme.mp3
    │   └── 20 Overseas Markets.mp3
    ├── Disk 3/
    │   ├── 01 Economic Influences.mp3
    │   ├── 02 Returns on Assets.mp3
    │   ├── 03 Valuation of Assets 1.mp3
    │   ├── 04 Valuation of Assets 2.mp3
    │   ├── 05 Investment Strategy 1.mp3
    │   ├── 06 Investment Strategy 2.mp3
    │   ├── 07Developing Strategy 1.mp3
    │   └── 08 Developing Strategy 2.mp3
    ├── Disk 4/
    │   ├── 01 Medelling.mp3
    │   ├── 02 Data.mp3
    │   ├── 03 Assumptions.mp3
    │   ├── 04 Expenses.mp3
    │   ├── 05 Pricing _ Funding.mp3
    │   ├── 06 Discontinuance.mp3
    │   ├── 07 Valuing liabilities 1.mp3
    │   ├── 08 Valuing liabilities 2.mp3
    │   ├── 09 Accounting _ Disclosure.mp3
    │   └── 10 Surplus Management.mp3
    └── Disk 5/
        ├── 02 Risks (benefit schemes).mp3
        ├── 03 Risks (insurance).mp3
        ├── 04 Risk Management.mp3
        ├── 05 Risk tools 1.mp3
        └── 06 Risk tools 2.mp3
```

### Total Files
- **44 audio files** across 5 disks
- All files are `.mp3` format
- Organized by disk/topic structure

## Upload Script

### Files Created
- `upload-audio-files.mjs` - Main upload script using ES modules
- `test-audio-scan.mjs` - Testing script for path verification

### Upload Strategy
- **Batch Processing**: 5 files per batch to avoid overwhelming the server
- **Path Preservation**: Maintains original folder structure in Supabase storage
- **Error Handling**: Tracks successful and failed uploads
- **Public URLs**: Generates public URLs for each uploaded file
- **Results Logging**: Saves upload results to `upload-results.json`

### Expected Storage Paths
Files will be stored in Supabase with paths like:
```
ca1-audio-files/
├── Disk 1 (Part 1- Part 2)/01 Introduction.mp3
├── Disk 1 (Part 1- Part 2)/02 Professionalism.mp3
├── Disk 2/12 Project Management.mp3
├── Disk 3/01 Economic Influences.mp3
├── Disk 4/01 Medelling.mp3
└── Disk 5/02 Risks (benefit schemes).mp3
```

## Usage in Application

### JavaScript Client Setup
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lbehbtrbaamfjozwfizy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZWhidHJiYWFtZmpvendmaXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzcxMzMsImV4cCI6MjA2OTM1MzEzM30.enjLqzvhZoondvjT-IxuTvZ9adzW4WosaSugIspY05U';

const supabase = createClient(supabaseUrl, supabaseKey);
```

### Accessing Audio Files
```javascript
// Get public URL for a specific audio file
const { data } = supabase.storage
  .from('ca1-audio-files')
  .getPublicUrl('Disk 1 (Part 1- Part 2)/01 Introduction.mp3');

console.log('Audio URL:', data.publicUrl);

// List all files in a specific disk
const { data: files, error } = await supabase.storage
  .from('ca1-audio-files')
  .list('Disk 1 (Part 1- Part 2)', {
    limit: 100,
    offset: 0
  });
```

## Authentication Setup

### Database Schema
- **User Profiles Table**: `public.user_profiles`
  - `id` (UUID): References `auth.users(id)`
  - `email` (TEXT): User's email address
  - `full_name` (TEXT): User's full name
  - `avatar_url` (TEXT): Profile picture URL
  - `study_level` (TEXT): User's study level (default: 'beginner')
  - `study_progress` (JSONB): Progress tracking data
  - `preferences` (JSONB): User preferences
  - `created_at` / `updated_at`: Timestamps

### Row Level Security (RLS)
- **Enabled** on `user_profiles` table
- **Policies**:
  - Users can view their own profile
  - Users can update their own profile
  - Users can insert their own profile

### Auto Profile Creation
- **Trigger**: `on_auth_user_created`
- **Function**: `handle_new_user()`
- Automatically creates user profile when new user signs up

### Frontend Authentication
- **Auth Context**: `AuthContext.tsx` - Manages auth state
- **Protected Routes**: All main routes require authentication
- **Login/Signup**: `/auth` route with form validation
- **User Profile**: Displayed in sidebar with logout functionality

### Auth Functions Available
```typescript
// Sign up new user
signUp(email, password, fullName)

// Sign in existing user
signIn(email, password)

// Sign out current user
signOut()

// Get current user
getCurrentUser()

// Get/update user profile
getUserProfile(userId)
updateUserProfile(userId, updates)

// Listen to auth state changes
onAuthStateChange(callback)
```

## Next Steps
1. ✅ Authentication system implemented
2. ✅ Audio playback functionality integrated
3. ✅ Component to browse and play audio files by disk/topic
4. Implement progress tracking for study sessions
5. Add metadata storage for audio file information (duration, topics, etc.)
6. Add user preferences and study level customization

## Security Notes
- The anonymous key provided has limited permissions
- Storage bucket is configured as public for easy access
- **Public Access Policies Created**: 
  - `Public Access` policy on `storage.objects` for `ca1-audio-files` bucket
  - `Public Bucket Access` policy on `storage.buckets` for `ca1-audio-files` bucket
- **No Restrictive Policies**: All policies allow full public access (SELECT, INSERT, UPDATE, DELETE)
- File size limits prevent abuse (50MB per file)
- MIME type restrictions ensure only audio files can be uploaded
- RLS is enabled but policies allow unrestricted access to the audio bucket
