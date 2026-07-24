import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

/**
 * Controlled image upload field.
 * value: existing image url (string) or null
 * onChange(file: File | null) - parent stores the raw File and sends via FormData on submit
 * onRemoveExisting() - called when user removes a previously-saved image
 */
export function ImageUploadField({ value, onChange, onRemoveExisting, isUploading, className }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  const displaySrc = preview || value;

  return (
    <div className={cn('space-y-2', className)}>
      {displaySrc ? (
        <div className="relative group w-full max-w-xs">
          <img
            src={displaySrc}
            alt="Preview"
            className="w-full h-44 object-cover rounded-2xl border border-border shadow-sm"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8 shadow-md"
              onClick={() => inputRef.current?.click()}
              title="Replace image"
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-8 w-8 shadow-md"
              onClick={() => {
                setPreview(null);
                onChange(null);
                onRemoveExisting?.();
              }}
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full max-w-xs h-44 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition flex flex-col items-center justify-center gap-2 text-muted-foreground"
        >
          <ImagePlus className="h-6 w-6" />
          <span className="text-sm">Click to upload image</span>
          <span className="text-xs">JPG, PNG, WEBP up to 5MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
