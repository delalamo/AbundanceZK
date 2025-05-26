import { useRef } from 'react';

import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';
import MolstarViewer from '../../components/MolstarViewer'; 

const footnotesConfig = [
    { id: 'fn1', doi: '10.1101/2025.05.09.653096' },
    { id: 'fn2', doi: '10.1038/s41587-023-01773-0' },
    { id: 'fn3', doi: '10.48550/arXiv.2403.09673' },
    { id: 'fn4', doi: '10.1126/science.ads0018' },
    { id: 'fn5', doi: '10.1101/2023.11.27.568722' },
    { id: 'fn6', doi: '10.1038/nature06407' },
    { id: 'fn7', doi: '10.1126/science.ade2574' },
    { id: 'fn8', doi: '10.1101/2020.12.15.422761' },
    { id: 'fn9', doi: '10.1142/9789811250477_0004' },
    { id: 'fn10', doi: '10.1101/2022.10.16.512436' },
    { id: 'fn11', doi: '10.1038/s41586-024-07487-w' }
];

export const post = {
  id: '2025-05-26-zk',
  title: '2025 week 21 updates',
  date: '2025-05-26',
  category: 'Zettelkasten updates',
  excerpt: 'Protein structure alignment with continuous and discrete embeddings, conformational dynamics from PLM attention matrices.',
  content: (() => {
    const ContentComponent = () => {
      const contentRef = useRef(null);
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' });

      // Define nmrViewerOptions for this specific Molstar instance
      const nmrViewerOptions = {
        landscape: true, // This was implied by your original HTML for #myViewer
        // sequencePanel: true, // Example: if you want sequence panel visible by default
        // hideCanvasControls: [], // Example: to show all canvas controls
      };

      return (
        <div className="content-container" ref={contentRef}>
          <p><i>This post includes updates from various papers and preprints that have been released this week, and aims to extract some key points rather than summarize them in their entirety.</i></p>
          
          <h4>Discrete tokens are worse for structural alignment than continuous embeddings</h4>
          <p>Last week, some researchers released code for a program, SoftAlign, which aligns two protein structures using embeddings derived from inverse folding models<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup>. Interestingly, they found that discretization/tokenization of the structure with algorithms like those used by Foldseek<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup> were far less useful at alignment than using the continuous embeddings here. However, the tokenization strategy they use was extremely aggressive, reducing the structure to an alphabet of twenty letters, compared to thousands used by some structure-aware protein language models<sup className="footnote-ref">[<a href="#fn3" id="fnref3"></a>, <a href="#fn4" id="fnref4"></a>, <a href="#fn5" id="fnref5"></a>]</sup>.</p>

          <h4>Fast protein dynamics drive slower conformational changes</h4>

          <p>This finding is from almost twenty years ago, but I only became aware of it recently. It's natural to distinguish between fast, easy-to-predict conformational changes, and slower, more functionally impactful movements. But Henzler-Wildman et al showed with adenylate kinase that faster movements in its hinge, but not other parts of the structure actually drive the slower opening-closing movements<sup className="footnote-ref">[<a href="#fn6" id="fnref6"></a>]</sup>. The challenge when studying other systems is to determine which of the faster modes actually drive the conformational change and which are simply along for the ride.</p>

          <h4>Contact probabilities from protein language models weakly correlate with dwell time of transient contacts in MD simulations.</h4>
          <i>This was mentioned to be by Chao Hou in a private correspondence.</i>
          <p>Previous work has shown that the attention matrices of protein language models can capture three-dimensional contacts in a protein structure<sup className="footnote-ref">[<a href="#fn7" id="fnref7"></a>, <a href="#fn8" id="fnref8"></a>, <a href="#fn9" id="fnref9"></a>]</sup>. One paper from several years ago takes things a step further and shows, across a panel of different proteins, that weak contacts with short dwell times in MD simulations tend to have weaker signal than long-lived contacts<sup className="footnote-ref">[<a href="#fn10" id="fnref10"></a>]</sup>. The model, MSA Transformer, is similar to modules used by protein folding neural networks to process sequence alignments<sup className="footnote-ref">[<a href="#fn11" id="fnref11"></a>]</sup>, which suggests that those larger models also have access to this information during modeling.</p>

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