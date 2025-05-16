import React, { useRef } from 'react'; // Import useRef
// Import the hooks and component (adjust paths as needed)
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

// Define config specific to this post - empty as there are no footnotes
const footnotesConfig = [];

export const post = {
  id: '2025-05-16-ablang-mpnn',
  title: 'Adapting ProteinMPNN for antibody design without retraining',
  date: '2025-05-16',
  category: 'Bio/ML',
  excerpt: 'A brief communication on how to make more antibody-like sequences using structural data.',
  content: (() => {
    // Component function to use hooks
    const ContentComponent = () => {
      const contentRef = useRef(null);

      // Use the custom hooks - they will handle the lack of footnotes gracefully
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig); // Pass empty config

      return (
        // Add container div with ref
        <div className="content-container" ref={contentRef}>
          {/* Original post content */}
          <p>Our recent preprint on antibody design has been released. This is several years old now, but during the time we've used this technology no comparable results have been published (to my knowledge).</p>

          <iframe
            src="https://www.biorxiv.org/content/10.1101/2025.05.09.653228v1.full.pdf"
            width="100%" // Or fixed width like "800px"
            height="600px" // Set a desired height
            style={{ border: '1px solid #ccc', marginTop: '1em', marginBottom: '1em' }} // Optional styling + spacing
            title="Embedded PDF Document" // Accessibility
          >
            Your browser does not support embedded PDFs. You can{' '}
            <a href="https://www.biorxiv.org/content/10.1101/2025.05.09.653228v1.full.pdf">download the PDF</a> instead.
          </iframe>

          {/* Render the reusable footnote list component */}
          {/* It will likely show "No citations found" or be empty */}
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