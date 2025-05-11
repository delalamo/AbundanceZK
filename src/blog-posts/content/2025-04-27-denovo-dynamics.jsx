import React, { useRef } from 'react'; // Import useRef
// Import the hooks and component (adjust paths as needed)
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

// Define config specific to this post - empty as there are no footnotes
const footnotesConfig = [];

export const post = {
  id: '2025-04-27-de-novo-dynamics-prediction',
  title: 'De novo prediction of protein structural dynamics',
  date: '2025-04-27',
  category: 'Bio/ML',
  excerpt: 'An overview of the state of the art that I will present on 28 April 2025.',
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
          <p>On Monday, 28 April 2025, I'll be presenting this overview of the state of <em>de novo</em> prediction of protein structural dynamics. Note that since it is a PDF, the animations were lost.</p>

          <iframe
            src="/assets/post_images/2025_04_27_PPT.pdf"
            width="100%" // Or fixed width like "800px"
            height="600px" // Set a desired height
            style={{ border: '1px solid #ccc', marginTop: '1em', marginBottom: '1em' }} // Optional styling + spacing
            title="Embedded PDF Document" // Accessibility
          >
            Your browser does not support embedded PDFs. You can{' '}
            <a href="/assets/post_images/2025_04_27_PPT.pdf">download the PDF</a> instead.
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