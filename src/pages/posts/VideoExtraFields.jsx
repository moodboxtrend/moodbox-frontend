import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Video, X } from 'lucide-react';

export function VideoExtraFields({ register, watch, setValue, videoFile, setVideoFile }) {
  const videoUrl = watch('videoDetails.videoUrl');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (setVideoFile) setVideoFile(file);
    }
  };

  const removeFile = () => {
    if (setVideoFile) setVideoFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="font-semibold">Upload Video File</Label>
        <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors hover:border-primary/50 bg-muted/20">
          {videoFile ? (
            <div className="flex items-center justify-between bg-card p-3 rounded-lg border">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <Video className="h-5 w-5" />
                </div>
                <div className="text-left truncate">
                  <p className="text-sm font-medium truncate">{videoFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 text-muted-foreground hover:text-destructive rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">Click to upload video file</p>
                  <p className="text-xs text-muted-foreground mt-0.5">MP4, MOV, WebM up to 100MB</p>
                </div>
              </div>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
      </div>

      {videoUrl && (
        <div className="space-y-1.5 pt-2">
          <Label className="text-xs text-muted-foreground">Current Video URL (Cloudinary)</Label>
          <Input value={videoUrl} readOnly className="bg-muted text-xs font-mono" />
        </div>
      )}
    </div>
  );
}
