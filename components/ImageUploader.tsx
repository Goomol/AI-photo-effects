import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { UploadedImage } from '../types';

interface ImageUploaderProps {
  imageCount: 1 | 2;
  imageLabels: string[];
  onUpload: (images: UploadedImage[]) => void;
  t: {
    dragAndDrop: string;
    or: string;
    browse: string;
    addPhoto: string;
    clickToBrowse: string;
  }
}

// Helper to convert a File object to a base64 data URL
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// A component for a single image preview slot
const ImageSlot: React.FC<{
  preview: string | null;
  label: string;
  onRemove: () => void;
  onClick: () => void;
  t: ImageUploaderProps['t'];
}> = ({ preview, label, onRemove, onClick, t }) => {
  if (preview) {
    return (
      <div className="relative w-full aspect-square group">
        <img src={preview} alt="Upload preview" className="object-cover w-full h-full rounded-lg" />
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 end-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Remove ${label}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/80 transition-colors duration-300"
      aria-label={`Upload ${label}`}
    >
      <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
      </svg>
      <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-cyan-400">{t.addPhoto.replace('{label}', label)}</span></p>
      <p className="text-xs text-gray-500">{t.clickToBrowse}</p>
    </button>
  );
};


export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageCount, imageLabels, onUpload, t }) => {
  const [previews, setPreviews] = useState<(string | null)[]>(Array(imageCount).fill(null));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Effect to notify the parent component whenever the uploaded images change
  useEffect(() => {
    const uploadedImages: UploadedImage[] = previews
      .filter((p): p is string => p !== null)
      .map((dataUrl) => {
        const [header, base64] = dataUrl.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        return { base64, mimeType };
      });
    onUpload(uploadedImages);
  }, [previews, onUpload]);


  const handleFiles = useCallback(async (files: FileList) => {
    const filesToProcess = Array.from(files);
    const dataUrlPromises = filesToProcess.map(file => fileToBase64(file).catch(e => {
      console.error("Error reading file:", e);
      return null;
    }));

    const dataUrls = (await Promise.all(dataUrlPromises)).filter((url): url is string => url !== null);

    setPreviews(currentPreviews => {
      const newPreviews = [...currentPreviews];
      let dataUrlIndex = 0;
      for (let i = 0; i < newPreviews.length; i++) {
        if (dataUrlIndex >= dataUrls.length) break;
        if (newPreviews[i] === null) {
          newPreviews[i] = dataUrls[dataUrlIndex];
          dataUrlIndex++;
        }
      }
      return newPreviews;
    });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Allow re-uploading the same file
      }
    }
  };

  const handleRemove = useCallback((index: number) => {
    setPreviews(currentPreviews => {
      const newPreviews = [...currentPreviews];
      newPreviews[index] = null;
      return newPreviews;
    });
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      handleFiles(event.dataTransfer.files);
    }
  }, [handleFiles]);


  return (
    <div className="flex flex-col gap-4">
       <input
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={imageCount > 1}
        aria-hidden="true"
      />

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`p-4 text-center border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 bg-gray-700/50'}`}
      >
        <p className="mb-2 text-sm text-gray-300 pointer-events-none">
          <span className="font-semibold text-cyan-400">{t.dragAndDrop}</span>
        </p>
        <p className="text-xs text-gray-400 pointer-events-none">{t.or}</p>
        <button onClick={openFileDialog} className="mt-2 text-sm text-cyan-400 font-semibold hover:underline">
          {t.browse}
        </button>
      </div>

      <div className={`grid grid-cols-1 ${imageCount > 1 ? 'sm:grid-cols-2' : ''} gap-4`}>
        {Array.from({ length: imageCount }).map((_, index) => (
          <ImageSlot
            key={index}
            preview={previews[index]}
            label={imageLabels[index]}
            onRemove={() => handleRemove(index)}
            onClick={openFileDialog}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};