import { useEffect, useState, useRef } from 'react';
import { Cite } from '@citation-js/core';
import '@citation-js/plugin-doi';
import '@citation-js/plugin-csl';
import '@citation-js/plugin-isbn'; // <-- Make sure this is imported

// Helper to extract inner HTML safely (keep as before)
const extractInnerHtml = (htmlString) => {
    if (typeof window === 'undefined') return htmlString;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.querySelector('.csl-entry')?.innerHTML || htmlString;
};

export function useCitationData(footnotesConfig = [], formatOptions = {}) {
  const [citationsData, setCitationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const effectRan = useRef(false);

  const defaultFormatOptions = {
    format: 'html',
    template: 'apa',
    lang: 'en-US',
    ...formatOptions,
  };

  useEffect(() => {
    if (effectRan.current || footnotesConfig.length === 0) return;

    const fetchCitations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const promises = footnotesConfig.map(async (footnote) => {
          if (!footnote || !footnote.id) {
             console.warn("Invalid footnote config item:", footnote);
             return { id: footnote?.id || 'unknown', formattedHtml: '<i>Invalid footnote data object</i>' };
          }

          // --- Check for manualHtml FIRST ---
          if (footnote.manualHtml) {
             return { id: footnote.id, formattedHtml: footnote.manualHtml };
          }
          // --- END Check ---

          let identifier;
          let idType = 'unknown'; // For better error messages

          if (footnote.doi) {
             identifier = footnote.doi;
             idType = 'DOI';
          } else if (footnote.isbn) {
             identifier = footnote.isbn;
             idType = 'ISBN';
          } else if (footnote.url) {
             identifier = footnote.url;
             idType = 'URL';
          } else {
             console.warn(`No valid identifier (DOI, ISBN, URL) or manualHtml found for footnote ID: ${footnote.id}`);
             return { id: footnote.id, formattedHtml: `<i>Missing citation identifier</i>` };
          }

          try {
            const citation = await Cite.async(identifier);
            const rawFormattedHtml = citation.format('bibliography', defaultFormatOptions);
            const cleanedHtml = extractInnerHtml(rawFormattedHtml).replace(/^\s*\d+\.\s*/, '');

            return {
              id: footnote.id,
              identifier: identifier,
              formattedHtml: cleanedHtml,
            };
          } catch (fetchError) {
            console.error(`Error fetching/formatting ${idType} ${identifier} for ${footnote.id}:`, fetchError);
            // Provide a more specific error message
            return { id: footnote.id, formattedHtml: `<i>Error loading citation for ${idType}: ${identifier}</i>` };
          }
        });

        const results = await Promise.all(promises);
        setCitationsData(results);

      } catch (processError) {
        console.error("Error processing citations:", processError);
        setError(processError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitations();
    effectRan.current = true;

  // Stringify options object or use template directly if options don't change otherwise
  }, [footnotesConfig, defaultFormatOptions.template]);

  return { citationsData, isLoading, error };
}