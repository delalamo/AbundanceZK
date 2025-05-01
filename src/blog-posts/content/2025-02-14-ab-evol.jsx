import React, { useRef } from 'react'; // Import useRef
// Import MathJax if needed (not used here)
// Import the hooks and component (adjust paths as needed)
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
// Ensure this hook uses the simplified version checking only 'doi' key
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

// Define config specific to this post
const footnotesConfig = [
    // DOI extracted from the original list item
    { id: 'fn1', doi: '10.1073/pnas.2412787122' }, // Kirby et al.
];

export const post = {
  id: '2025-02-14-antibody-evolution-observations',
  title: 'Observations on how antibodies evolve',
  date: '2025-02-14',
  category: 'Bio/ML',
  excerpt: 'A recent study on anti-SARS-CoV-2 antibodies retraces the steps they take during affinity maturation.',
  content: (() => {
    // Component function to use hooks
    const ContentComponent = () => {
      const contentRef = useRef(null);

      // Use the custom hooks
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' }); // Using APA style

      return (
        // Add container div with ref
        <div className="content-container" ref={contentRef}>
          {/* Main blog post JSX content goes here... */}
          {/* Ensure <sup class="footnote-ref">[<a href="#fnX" id="fnrefX"></a>]</sup> structure is used */}
          <p>A recent study on anti-SARS-CoV-2 antibodies retraces the steps they take during affinity maturation.</p>

          <p>Antibodies evolve differently from most proteins. Instead of maintaining functions and/or interactions across different organisms, antibodies evolve specificity to targets of interest within organisms, in a Darwinian process called somatic hypermutation. During this process, they collect point mutations that increase their affinity to their target, with the end result being a slightly modified antibody sequence that binds with nanomolar or picomolar affinity and (usually) very high specificity.</p>

          {/* The footnote reference tag should already be correctly placed */}
          <p><a href="https://doi.org/10.1073/pnas.2412787122">Kirby et al</a><sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup> recently examined the evolutionary trajectories taken by fourteen high-affinity antibodies to see what the overall effect of each mutation was, relative to the germline precursor. Their results are quite interesting and are summarized as follows:</p>

          <ul>
            <li>The mutations obtained during affinity maturation can be obtained in any order, arguing that epistasis is not a problem.</li>
            <li>Most mutations (47 out of 51) are the result of single-nucleotide changes, suggesting that the DNA sequence of the germline introduces a hard constraint on the accessible evolutionary space.</li>
            <li>Germline precursors to high-affinity antibodies already bind with nanomolar affinity, and most mutations obtained during affinity maturation don't actually improve on this</li>
            <li>More evolutionary "steps" are required for germline antibodies to evolve to broadly neutralizing antibodies that can bind to many different variants of SARS-CoV-2</li>
          </ul>

          <p>Incidentally, this is the first time I used an LLM to find a paper - I asked Gemini to find a citation for the claim that germline antibodies can already have nanomolar binding affinity to their targets, and it replied with this paper.</p>

          {/* Render the reusable footnote list component */}
          {/* The old <section> with hardcoded <ol> is removed */}
          <FootnoteList
            citationsData={citationsData}
            idToNumberMap={idToNumberMap}
            isLoading={isLoading}
            error={error}
          />
        </div> // Close content-container
      );
    };
    // Return the component to be rendered
    return <ContentComponent />;
  })(), // Immediately invoke the function
};