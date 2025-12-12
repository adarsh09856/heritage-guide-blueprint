import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type BucketName = 'images' | 'videos' | 'documents';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, bucket: BucketName, path?: string): Promise<string> => {
    setIsUploading(true);
    setProgress(0);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          upsert: true,
          onUploadProgress: (progressEvent) => {
            const percent = (progressEvent.loaded / progressEvent.total) * 100;
            setProgress(Math.round(percent));
          }
        } as any);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      return publicUrl;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const uploadMultiple = async (files: File[], bucket: BucketName): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      const url = await upload(file, bucket);
      urls.push(url);
    }
    
    return urls;
  };

  const deleteFile = async (url: string, bucket: BucketName): Promise<void> => {
    // Extract path from URL
    const urlParts = url.split(`${bucket}/`);
    if (urlParts.length < 2) return;
    
    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) throw error;
  };

  return {
    upload,
    uploadMultiple,
    deleteFile,
    isUploading,
    progress
  };
}
