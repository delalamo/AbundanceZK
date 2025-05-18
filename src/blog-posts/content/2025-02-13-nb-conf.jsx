import React, { useRef } from 'react'; // Import useRef
// Import MathJax if needed (not used here)
// Import the hooks and component (adjust paths as needed)
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
// Ensure this hook uses the simplified version checking only 'doi' key
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

// Define config specific to this post using the 'doi' key
const footnotesConfig = [
    { id: 'fn1', doi: '10.1016/j.tibs.2024.06.002' }, // Wu, Xudong
    { id: 'fn2', doi: '10.1038/s41586-024-07487-w' }, // Abramson, Josh, et al.
    { id: 'fn3', doi: '10.1101/2024.09.21.614257' }, // Hitawala, Fatima N. et al. (Biorxiv DOI)
    { id: 'fn4', doi: '10.1021/acs.jcim.4c01877' },  // Eshak, Floriane et al.
    { id: 'fn5', doi: '10.1016/j.str.2014.11.010' }, // Weitzner, Brian D. et al.
    { id: 'fn6', doi: '10.1016/j.sbi.2025.102983' }, // Greenshields-Watson, et al.
];

export const post = {
  id: '2025-02-13-nanobody-cdr3-prediction',
  title: 'Nanobody CDR3 structure prediction',
  date: '2025-02-13',
  category: 'Bio/ML',
  excerpt: "Four years after the protein folding problem was allegedly solved, we still can't reliably predict how or where antibodies bind to their antigens. A recent report identifies one source of continued difficulty.",
  content: (() => {
    // Component function to use hooks
    const ContentComponent = () => {
      const contentRef = useRef(null);

      // Use the custom hooks
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' }); // Using APA style

      return (
        <div className="content-container" ref={contentRef}>
          {/* Main blog post JSX content goes here... */}
          {/* Ensure <sup class="footnote-ref">[<a href="#fnX" id="fnrefX"></a>]</sup> structure is used */}
          <p>Four years after the protein folding problem was allegedly solved, we still can't reliably predict how or where antibodies bind to their antigens. A recent report identifies one source of continued difficulty.</p>

          <p>Nanobodies are single-domain antibodies used as clinical therapeutics and experimental reagents for tasks such as bulking up protein structures for cryo-EM<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup>. Despite their smaller size, they share the same difficulties as traditional antibodies when it comes to structure prediction, namely the inability to reliably predict how and where they bind their targets, with success rates ranging in the 33-50% range<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>,<a href="#fn3" id="fnref3"></a>]</sup>. A report published last week<sup className="footnote-ref">[<a href="#fn4" id="fnref4"></a>]</sup> identifies a major determinant of whether the binding mode is correctly predicted: the "kink" or bend found in many CDR3 loops that is also found in most human antibodies<sup className="footnote-ref">[<a href="#fn5" id="fnref5"></a>]</sup>. The recent structure prediction tool AlphaFold3 correctly docked nanobodies to their antigens nearly 80% of the time when the CDR3 conformation was extended, but barely 25% of the time when it was kinked.</p>

          <p style={{ textAlign: 'center' }}>
            <img src="/assets/post_images/2025_02_09/2025_02_09_A.png" alt="Kinked CDR3 loops are more difficult to predict than extended loops" width="600" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto', maxWidth: '100%' }} />
          </p>
          <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
                <span style={{ fontStyle: 'italic' }}>Figure from </span><sup className="footnote-ref">[<a href="#fn4" id="fnref4_fig1"></a>]</sup>
          </p>

          <p>Fortunately, these models were effective at predicting whether the kink was there or not.</p>

           <p style={{ textAlign: 'center' }}>
            <img src="/assets/post_images/2025_02_09/2025_02_09_B.png" alt="CDR3 conformation is mostly correctly predicted by AlphaFold2 and AlphaFold3" width="400" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto', maxWidth: '100%' }}/>
          </p>
            <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
                <span style={{ fontStyle: 'italic' }}>Figure from </span><sup className="footnote-ref">[<a href="#fn4" id="fnref4_fig2"></a>]</sup>
            </p>

          <p>In any case, whether that observation extends to human paired antibodies, the structures of which are more difficult to predict<sup className="footnote-ref">[<a href="#fn6" id="fnref6"></a>]</sup>, remains to be seen.</p>


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