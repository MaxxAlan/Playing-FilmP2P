import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

// Simple in-memory cache
const trailerCache = new Map<string, string>();

export const useTrailerSearch = () => {
  const [trailerId, setTrailerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentSearchRef = useRef<string | null>(null);

  const searchTrailer = useCallback(async (movieTitle: string, movieYear?: number) => {
    const searchQuery = `${movieTitle} ${movieYear || ''}`.trim();

    // Prevent duplicate requests for the same movie while one is in flight
    if (isLoading && currentSearchRef.current === searchQuery) {
      return;
    }
    
    currentSearchRef.current = searchQuery;

    // Check cache first
    if (trailerCache.has(searchQuery)) {
      setTrailerId(trailerCache.get(searchQuery) ?? null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrailerId(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const prompt = `Find the official YouTube trailer for the movie "${movieTitle}" released around ${movieYear}. Provide only the YouTube video ID.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              youtubeId: {
                type: Type.STRING,
                description: 'The unique YouTube video ID for the official movie trailer.',
              },
            },
            required: ["youtubeId"],
          },
        },
      });

      // A more robust way to parse the JSON response from the model.
      // The model might return the JSON wrapped in markdown, so we extract it.
      let jsonText = response.text.trim();
      const jsonMatch = jsonText.match(/\{.*\}/s);
      if (jsonMatch) {
          jsonText = jsonMatch[0];
      }
      
      const result = JSON.parse(jsonText);
      
      if (result && result.youtubeId) {
        setTrailerId(result.youtubeId);
        trailerCache.set(searchQuery, result.youtubeId); // Save to cache
      } else {
        throw new Error('No YouTube ID found in AI response.');
      }

    } catch (e) {
      console.error("Failed to fetch trailer from Gemini API:", e);
      setError("Could not find a trailer for this movie.");
      setTrailerId(null);
      // Cache the negative result to avoid refetching for a trailer that can't be found
      trailerCache.set(searchQuery, '');
    } finally {
      setIsLoading(false);
      currentSearchRef.current = null;
    }
  }, [isLoading]);

  return { trailerId, isLoading, error, searchTrailer };
};
