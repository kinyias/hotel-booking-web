'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: { url: string }[];
  onChange: (value: { url: string }[]) => void;
  onRemove: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const replacingIndexRef = useRef<number | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
    // Reset input value to allow selecting the same file again if needed
    if (e.target) {
        e.target.value = '';
    }
  };

  const handleReplaceChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const index = replacingIndexRef.current;
    
    if (e.target.files && e.target.files[0] && index !== null) {
      const file = e.target.files[0];
      const newImage = {
        url: URL.createObjectURL(file),
        file,
      };

      const updatedValues = [...value];
      updatedValues[index] = newImage;
      onChange(updatedValues);
      replacingIndexRef.current = null;
    }
     // Reset input value
     if (e.target) {
        e.target.value = '';
    }
  };

  const handleFiles = (files: File[]) => {
    // In a real app, we would upload these files to a server here.
    // For this demo, we'll create object URLs.
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file), // Simulate upload
      file, // Store file if needed for actual upload later
    }));

    onChange([...value, ...newImages]);
  };

  const onButtonClick = () => {
    console.log('Button clicked');
    inputRef.current?.click();
  };

  // ... inside ImageUpload component ...

  const onReplaceClick = (e: React.MouseEvent, index: number) => {
      e.stopPropagation(); // Prevent triggering the main card click
      console.log('Replace clicked');
      replacingIndexRef.current = index;
      replaceInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'relative flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed transition-colors cursor-pointer',
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-border bg-card hover:bg-muted/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">
                Click to upload
            </span>{' '}
            or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
            SVG, PNG, JPG or GIF (max. 5MB)
            </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          ref={replaceInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleReplaceChange}
          disabled={disabled}
        />
          {value.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-md overflow-hidden border border-border group"
            >
              <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  onClick={(e) => onReplaceClick(e, index)}
                  variant="secondary"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-white/80 hover:bg-white text-gray-700"
                  title="Replace"
                >
                  <Upload className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  onClick={(e) => {
                      e.stopPropagation();
                      onRemove(image.url);
                  }}
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Image
                fill
                src={image.url}
                alt="Room Image"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
