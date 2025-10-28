import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { EffectSelector } from './components/EffectSelector';
import { EffectDetail } from './components/EffectDetail';
import { generateImage } from './services/geminiService';
import * as feedbackService from './services/feedbackService';
import { translations } from './translations';
import { BASE_EFFECTS } from './constants';
import type { Effect, UploadedImage, Ratings, SortOption } from './types';

type Language = 'en' | 'fa';

function App() {
  // State Management
  const [language, setLanguage] = useState<Language>('en');
  const [selectedEffectId, setSelectedEffectId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Ratings>({});
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Load ratings on initial render
  useEffect(() => {
    setRatings(feedbackService.getRatings());
  }, []);

  // Translations and Effects Data
  const t = useMemo(() => translations[language], [language]);
  const effects: Effect[] = useMemo(() => {
    const translatedEffects = BASE_EFFECTS.map((effect) => ({
      ...effect,
      title: t.effects[effect.id]?.title ?? 'Effect',
      description: t.effects[effect.id]?.description ?? 'Description',
      likes: ratings[effect.id]?.likes ?? 0,
      dislikes: ratings[effect.id]?.dislikes ?? 0,
    }));

    switch (sortBy) {
      case 'popular':
        return translatedEffects.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
      case 'alphabetical':
        return translatedEffects.sort((a, b) => a.title.localeCompare(b.title, language));
      case 'newest':
      default:
        return translatedEffects;
    }
  }, [t, ratings, sortBy, language]);

  const selectedEffect = useMemo(
    () => effects.find((e) => e.id === selectedEffectId),
    [selectedEffectId, effects]
  );

  // Reset inputs when effect changes
  useEffect(() => {
    setUploadedImages([]);
    setGeneratedImage(null);
    setError(null);
  }, [selectedEffectId]);
  
  // Handlers
  const handleLanguageToggle = useCallback(() => {
    const nextLang = language === 'en' ? 'fa' : 'en';
    setLanguage(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  const handleEffectSelect = useCallback((effectId: string) => {
    window.scrollTo(0, 0);
    setSelectedEffectId(effectId);
  }, []);

  const handleGoBack = useCallback(() => {
    setSelectedEffectId(null);
  }, []);

  const handleImageUpload = useCallback((images: UploadedImage[]) => {
    setUploadedImages(images);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedEffect || uploadedImages.length < selectedEffect.imageCount) {
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const result = await generateImage(selectedEffect.prompt, uploadedImages);
      setGeneratedImage(result);
    } catch (e: any) {
      setError(e.message || 'UNKNOWN_ERROR');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEffect, uploadedImages]);
  
  const handleRetry = () => {
    setError(null);
    handleSubmit();
  };

  const handleDownload = () => {
    if (!generatedImage || !selectedEffect) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${generatedImage}`;
    link.download = `${selectedEffect.id}-result.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleFeedback = (rating: 'good' | 'bad') => {
    if (!selectedEffect) return;
    const newRatings = feedbackService.saveRating(selectedEffect.id, rating);
    setRatings(newRatings);
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      <Header t={t} onLanguageToggle={handleLanguageToggle} />
      <main className="container mx-auto p-4 md:p-8">
        {selectedEffect ? (
          <EffectDetail
            effect={selectedEffect}
            uploadedImages={uploadedImages}
            generatedImage={generatedImage}
            isLoading={isLoading}
            error={error}
            ratings={ratings[selectedEffect.id]}
            onUpload={handleImageUpload}
            onSubmit={handleSubmit}
            onDownload={handleDownload}
            onRetry={handleRetry}
            onFeedback={handleFeedback}
            onBack={handleGoBack}
            t={t}
          />
        ) : (
          <EffectSelector
            effects={effects}
            onSelect={handleEffectSelect}
            sortBy={sortBy}
            onSortChange={setSortBy}
            t={{
              selectEffect: t.selectEffect,
              sortBy: t.sortBy,
              sortPopular: t.sortPopular,
              sortAlphabetical: t.sortAlphabetical,
              sortNewest: t.sortNewest,
              likes: t.likes,
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
