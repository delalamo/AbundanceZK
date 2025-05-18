import React, { useRef } from 'react'; // No useEffect/useState needed here anymore
// Import the hooks and component
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering'; // Adjust path
import { useCitationData } from '../../hooks/useCitationData'; // Adjust path
import { FootnoteList } from '../../components/FootnoteList'; // Adjust path

// Define config specific to this post
const footnotesConfig = [
  { id: 'fn1', doi: '10.1101/2022.12.21.521521' }, // Note: Check if DOI is correct for Verkuil
  { id: 'fn2', doi: '10.1126/science.ade2574' },
  { id: 'fn3', doi: '10.1101/2022.04.10.487779' },
  { id: 'fn4', doi: '10.1101/2023.10.01.560349' },
  { id: 'fn5', doi: '10.1101/2023.12.07.570727' },
  { id: 'fn6', doi: '10.1101/2025.02.13.638154' },
  { id: 'fn7', doi: '10.1038/s41586-023-06328-6' },
  { id: 'fn8', doi: '10.1073/pnas.2314853121' },
  { id: 'fn9', doi: '10.1101/2024.08.03.606485' },
];

export const post = {
  id: '2025-02-20-structural-adaptors',
  title: 'Structural adaptors for protein property prediction',
  date: '2025-02-20',
  category: 'Bio/ML',
  excerpt: "It's always tricky to choose which protein neural network to use for fine-tuning tasks.",
  content: (() => {
    // Component function still needed to use hooks
    const ContentComponent = () => {
      const contentRef = useRef(null);

      // Use the custom hooks
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' }); // Specify style here if needed

      return (
        <div className="content-container" ref={contentRef}>
          {/* Main blog post JSX content goes here... */}
          {/* Ensure it includes the <sup className="footnote-ref">[<a href="#fnX" id="fnrefX"></a>]</sup> markers */}
           <p>It's always tricky to choose which protein neural network to use for fine-tuning tasks.</p>
           {/* ... rest of paragraphs with footnote markers ... */}
           <p>Inverse folding neural networks like ProteinMPNN<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup> have the advantage of working with explicit protein structures, but don't leverage the huge sequence databases we have available, whereas the opposite is true for protein language models like ESM<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup>. Some methods, such as ESM-IF1<sup className="footnote-ref">[<a href="#fn3" id="fnref3"></a>]</sup>, try to bridge the gap by predicting structures from sequence and training from those, but those predicted structures aren't as informative as experimental structures<sup className="footnote-ref">[<a href="#fn4" id="fnref4"></a>]</sup>. In any case, it's clear that structure-based neural networks are best for zero-shot prediction of things like stability and protein-protein binding affinity prediction, whereas sequence-based neural networks are better at predicting things like catalytic activity and overall contribution to organismal fitness<sup className="footnote-ref">[<a href="#fn5" id="fnref5"></a>]</sup>.</p>
            <p>A recent preprint by Li & Luo<sup className="footnote-ref">[<a href="#fn6" id="fnref6"></a>]</sup> discusses a way to combine both types of neural networks when fine-tuning for protein property prediction. Their method, names SPURS, introduces the final embeddings from the structure-based neural network ProteinMPNN into each intermediate layer of ESM2, thereby passing on the advantages of that 3D information to the sequence-based model.</p>
            <img src="/assets/post_images/2025_02_20/2025_02_20_A.png" alt="Overall setup of the SPURS neural network" width="700" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
            <p style={{ textAlign: 'center', fontSize: '0.9em' }}><span style={{ fontStyle: 'italic' }}>Figure from </span><sup className="footnote-ref">[<a href="#fn6" id="fnref6_fig1"></a>]</sup></p>
            <p>After fine-tuning this network on the mega-scale dataset by Tsuboyama et al<sup className="footnote-ref">[<a href="#fn7" id="fnref7"></a>]</sup>, which measured nearly a million stability measurements across several hundred proteins, they end up with a state-of-the-art thermostability predictor. This beats ThermoMPNN, a fine-tuned version of ProteinMPNN trained on the same dataset<sup className="footnote-ref">[<a href="#fn8" id="fnref8"></a>]</sup>, directly showing how adding the language model into the mix contributed to performance.</p>
            <img src="/assets/post_images/2025_02_20/2025_02_20_B.png" alt="Performance of SPURS compared to its competitors on various datasets" width="700" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
            <p style={{ textAlign: 'center', fontSize: '0.9em' }}><span style={{ fontStyle: 'italic' }}>Figure from </span><sup className="footnote-ref">[<a href="#fn6" id="fnref6_fig2"></a>]</sup></p>
            <p>This isn't the first time structural adaptors for language models have been discussed; Ruffolo et al<sup className="footnote-ref">[<a href="#fn9" id="fnref9"></a>]</sup> discussed the idea for generative modeling using the ProGen language model late last year. But this is (to my knowledge) the first time I've seen it for this kind of property prediction. It's also worth noting that this scheme only works when large-scale data is available, as it adds thousands of parameters that would, in a normal experimental setup, be underdetermined without some kind of regularization.</p>


          {/* Render the reusable footnote list component */}
          <FootnoteList
            citationsData={citationsData}
            idToNumberMap={idToNumberMap}
            isLoading={isLoading}
            error={error}
          />
        </div>
      );
    };
    return <ContentComponent />;
  })(),
};