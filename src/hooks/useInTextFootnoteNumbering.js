import { useEffect, useState, useRef } from 'react';

export function useInTextFootnoteNumbering(contentRef) {
  const [idToNumberMap, setIdToNumberMap] = useState({});
  // Ref to prevent effect running multiple times unnecessarily in strict mode/dev
  const effectRan = useRef(false);

  useEffect(() => {
    // Prevent running twice in React 18 Strict Mode (dev only)
    if (effectRan.current || !contentRef.current) return;

    const container = contentRef.current;
    const footnoteLinks = container.querySelectorAll('.footnote-ref a');
    const footnoteMap = {}; // Local map { #fn1: 1, #fn2: 2, ... }
    const idMap = {};     // Local map { fn1: 1, fn2: 2, ... }
    let footnoteCounter = 0;

    footnoteLinks.forEach(link => {
      const href = link.getAttribute('href'); // e.g., #fn1
      if (!href || !href.startsWith('#')) return;
      const id = href.substring(1); // e.g., fn1

      let number;
      if (footnoteMap.hasOwnProperty(href)) {
        number = footnoteMap[href];
      } else {
        footnoteCounter++;
        number = footnoteCounter;
        footnoteMap[href] = number;
        idMap[id] = number; // Store mapping for list numbering
      }
      // Inject the number into the link
      link.textContent = number;
    });

    setIdToNumberMap(idMap); // Update state

    // Mark effect as run
    effectRan.current = true;

    // No cleanup needed for simple text injection unless content changes dynamically
  }, [contentRef]); // Re-run if contentRef changes (shouldn't usually)

  return idToNumberMap;
}