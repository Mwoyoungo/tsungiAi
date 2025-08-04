import React from 'react';
import { ComingSoon } from '@/components/ComingSoon';
import { Upload } from 'lucide-react';

const AudioUpload: React.FC = () => {
  return (
    <ComingSoon
      title="Audio Upload Hub"
      description="Upload and organize your actuarial study materials with ease. Support for multiple audio formats, batch uploads, and smart organization."
      icon={Upload}
      features={[
        "Drag & drop batch audio file uploads",
        "Smart folder organization by exam topics",
        "Audio format conversion and optimization",
        "Progress tracking with resume capability",
        "Integration with cloud storage providers"
      ]}
      estimatedDate="Q1 2025"
    />
  );
};

export default AudioUpload;