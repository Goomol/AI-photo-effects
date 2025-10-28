
import React from 'react';
import { ImageUploader } from './ImageUploader';
import { ResultDisplay } from './ResultDisplay';
import type { Effect, UploadedImage } from '../types';

interface EffectDetailProps {
  effect: Effect;
  uploadedImages: UploadedImage[];
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  onUpload: (images: UploadedImage[]) => void;
  onSubmit: () => void;
  onDownload: () => void;
  onRetry: () => void;
  onBack: () => void;
  t: any; // Using `any` for simplicity, should be properly typed from translations
}

const ButtonSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const EffectDetail: React.FC<EffectDetailProps> = ({
  effect,
  uploadedImages,
  generatedImage,
  isLoading,
  error,
  onUpload,
  onSubmit,
  onDownload,
  onRetry,
  onBack,
  t
}) => {
  const isGenerateButtonDisabled = isLoading || uploadedImages.length < effect.imageCount;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6 text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.backToEffects}
        </button>
        <div className="text-center border-b border-gray-800 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100">{effect.title}</h1>
            <p className="mt-2 text-md text-gray-400 max-w-3xl mx-auto">{effect.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-200 border-b-2 border-gray-700 pb-2">
            {effect.imageCount === 1 ? t.uploadYourPhoto : t.uploadYourPhotos}
          </h2>
          <ImageUploader
            imageCount={effect.imageCount}
            imageLabels={effect.imageLabels}
            onUpload={onUpload}
            t={{
              dragAndDrop: t.dragAndDrop,
              or: t.or,
              browse: t.browse,
              addPhoto: t.addPhoto,
              clickToBrowse: t.clickToBrowse,
            }}
          />
          <button
            onClick={onSubmit}
            disabled={isGenerateButtonDisabled}
            className="w-full bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <ButtonSpinner />
                <span>{t.generating}</span>
              </>
            ) : (
              t.generate
            )}
          </button>
        </div>

        <ResultDisplay
          isLoading={isLoading}
          generatedImage={generatedImage}
          error={error}
          onDownload={onDownload}
          onRetry={onRetry}
          t={{
            result: t.result,
            generating: t.generating,
            download: t.download,
            tryAgain: t.tryAgain,
            errorTitle: t.errorTitle,
            errorSafety: t.errorSafety,
            errorApi: t.errorApi,
            errorNoImage: t.errorNoImage,
            errorUnknown: t.errorUnknown,
          }}
        />
      </div>
    </div>
  );
};
