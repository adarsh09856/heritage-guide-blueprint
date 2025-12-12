import { useState } from 'react';
import { Upload, FileImage, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from 'sonner';

export const MediaManager = () => {
  const { upload, isUploading } = useFileUpload();
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: 'images' | 'videos' | 'documents') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await upload(file, bucket);
      if (url) {
        setUploadedFiles(prev => [{ name: file.name, url }, ...prev]);
        toast.success('File uploaded!');
      }
    } catch (error) {
      toast.error('Upload failed');
    }
  };

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold">Media Manager</h1>
          <p className="text-muted-foreground">Upload and manage media files</p>
        </div>
      </div>

      {/* Upload Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-background rounded-xl p-6 shadow-heritage-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileImage className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Images</h3>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP</p>
            </div>
          </div>
          <Label htmlFor="image-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload image</p>
            </div>
            <Input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'images')}
              disabled={isUploading}
            />
          </Label>
        </div>

        <div className="bg-background rounded-xl p-6 shadow-heritage-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center">
              <FileImage className="w-5 h-5 text-forest" />
            </div>
            <div>
              <h3 className="font-semibold">Videos</h3>
              <p className="text-xs text-muted-foreground">MP4, WebM</p>
            </div>
          </div>
          <Label htmlFor="video-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload video</p>
            </div>
            <Input 
              id="video-upload" 
              type="file" 
              accept="video/*" 
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'videos')}
              disabled={isUploading}
            />
          </Label>
        </div>

        <div className="bg-background rounded-xl p-6 shadow-heritage-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <FileImage className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-semibold">Documents</h3>
              <p className="text-xs text-muted-foreground">PDF, DOC</p>
            </div>
          </div>
          <Label htmlFor="doc-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload document</p>
            </div>
            <Input 
              id="doc-upload" 
              type="file" 
              accept=".pdf,.doc,.docx" 
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'documents')}
              disabled={isUploading}
            />
          </Label>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-background rounded-xl shadow-heritage-sm">
          <div className="p-6 border-b border-border">
            <h2 className="font-serif text-lg font-semibold">Recently Uploaded</h2>
          </div>
          <div className="divide-y divide-border">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <FileImage className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{file.url}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyToClipboard(file.url)}
                >
                  {copiedUrl === file.url ? (
                    <Check className="w-4 h-4 text-forest" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedFiles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Uploaded files will appear here</p>
        </div>
      )}
    </>
  );
};
