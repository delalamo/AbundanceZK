import { useRef } from 'react';

import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';
import MolstarViewer from '../../components/MolstarViewer'; 

const footnotesConfig = [
    { id: 'fn0', doi: '10.1101/2025.05.03.652001' },
    { id: 'fn1', doi: '10.1126/science.add2187' },
    { id: 'fn2', doi: '10.1101/2022.04.10.487779' },
    { id: 'fn3', doi: '10.1073/pnas.2314853121' },
    { id: 'fn4', doi: '10.1101/2023.12.15.571823' },
    { id: 'fn5', doi: '10.1101/2025.05.13.652389' },
    { id: 'fn6', doi: '10.1101/2024.12.05.626885' },
    { id: 'fn7', doi: '10.1038/s42003-025-07791-9' },
    { id: 'fn9', doi: '10.1101/2025.02.21.639315' },
    { id: 'fn8', doi: '10.1126/science.adt7268' },
    { id: 'fn10', doi: '10.1093/bioinformatics/btad027' },
    { id: 'fn11', doi: '10.1101/2025.05.09.653228' },
    { id: 'fn12', doi: '10.1093/bioadv/vbac046' },
    { id: 'fn13', doi: '10.1038/s42003-023-04927-7' },
    { id: 'fn14', doi: '10.1038/s41467-023-38063-x' },
];

export const post = {
  id: '2025-05-18-zk',
  title: '2025 week 20 updates',
  date: '2025-05-18',
  category: 'Zettelkasten updates',
  excerpt: 'Protein dynamics prediction using inverse folding models, antibody structure prediction, and directed evolution.',
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
          
          <h4>Inverse folding NNs are better predictors of equilibrium dynamics than protein folding NNs</h4>
          <p>Two preprints were released that began to hint at the limits of recent protein ensemble prediction methods. First, Cavanagh et al show that they aren't able to accurately model sequence-induced changes in a protein's equilibrium dynamics, meaning what proportion of the ensemble is in one state vs another<sup className="footnote-ref">[<a href="#fn0" id="fnref0"></a>]</sup>. Instead, they found that a suite of inverse folding methods - ProteinMPNN<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup>, ESM-IF<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup>, ThermoMPNN<sup className="footnote-ref">[<a href="#fn3" id="fnref3"></a>]</sup>, and Frame2Seq<sup className="footnote-ref">[<a href="#fn4" id="fnref4"></a>]</sup> - were better able to predict when mutations destabilize one state more than another.</p>

          <img src="/assets/post_images/2025_05_18/2025_05_18_A.png" alt="BioEmu prediction of equilibrium dynamics." width="500" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />

          <h4>Protein conformational sampling and ranking does not lead to greater success in finding models for protein-protein docking</h4>

          <p>The second finding was from Kyrylenko et al, who looked at cases where a protein undergoes a conformational change when bound to a binding partner that cannot be predicted by structure prediction methods like AlphaFold2<sup className="footnote-ref">[<a href="#fn0" id="fnref0"></a>]</sup>. They found that conformational samplers like BioEmu<sup className="footnote-ref">[<a href="#fn6" id="fnref6"></a>]</sup> and adaptations like AFSample2<sup className="footnote-ref">[<a href="#fn7" id="fnref7"></a>]</sup> were also unable to model the change in these cases, and that their output were unusable for protein docking calculations. This is consistent with other results from last year showing a strong preference for one state in a report showing slight conformational heterogeneity in crystal structures.</p>

          <h4>Rigidification of an enzyme's active site correlates with greater activity</h4>

          <p>This has been well-described for many years already<sup className="footnote-ref">[<a href="#fn8" id="fnref8"></a>]</sup>, but Hou et al provide us with a fresh example in a group of de novo designed enzymes<sup className="footnote-ref">[<a href="#fn9" id="fnref9"></a>]</sup>. When two closely-related enzymes differ in activity, one source can be that their active sites show different dynamics. In this case, enzymes with correctly preorganized active sites tend to be more active, as they spend less time in unproductive states. This was observed using molecular dynamics simulations on a series of enzymes that were progressively evolved in the laboratory to have higher activity.</p>

          <h4>Directed evolution can uncover active sequences that might be missed by machine learning-based sequence design</h4>

          <p>In the same paper, the authors discover an interesting mid-helical alanine-to-proline mutation that improved catalytic activity using directed evolution. The prior steps in their pipeline involved structure-based sequence design, and these methods tend to be very opinionated about prolines (i.e., don't tend to add them where they don't already exist). Here's the confusion matrix for ESM-IF alongside the BLOSUM62 substitution matrix: proline is the clear outlier, likely due to its unique Ramachandran profile<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup>.</p>

          <img src="https://www.biorxiv.org/content/biorxiv/early/2022/04/10/2022.04.10.487779/F13.large.jpg" alt="Machine learning models learn substitution matrics for all amino acids besides proline." width="700" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />

          <p>...and here's the substitution matrix from Castorina et al<sup className="footnote-ref">[<a href="#fn10" id="fnref10"></a>]</sup></p>:

          <img src="/assets/post_images/2025_05_18/2025_05_18_B.png" alt="Machine learning models learn substitution matrics for all amino acids besides proline." width="400" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />

          <p>...and one more from the authors of Frame2Seq<sup className="footnote-ref">[<a href="#fn4" id="fnref4"></a>]</sup>, showing how proline sticks out in UMAP projections of residue embeddings</p>:

          <img src="/assets/post_images/2025_05_18/2025_05_18_C.png" alt="Proline sticks out in UMAP projections of inverse folding embeddings." width="700" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
        
          <p>It's just one more example of how one-shot ML-based sequence design complements, rather than replaces, more laborious laboratory evolution techniques.</p>

          <h4>Antibody structure prediction methods probably memorize CDRH3 conformations</h4>

          <p>On Wednesday, we preprinted some work<sup className="footnote-ref">[<a href="#fn11" id="fnref11"></a>]</sup> from a few years ago on ensembling the popular inverse folding method ProteinMPNN<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup> with the antibody language model AbLang<sup className="footnote-ref">[<a href="#fn12" id="fnref12"></a>]</sup>. In the process of doing this work, I found that the structure prediction methods ABodyBuilder2<sup className="footnote-ref">[<a href="#fn13" id="fnref13"></a>]</sup> and IgFold<sup className="footnote-ref">[<a href="#fn14" id="fnref14"></a>]</sup> tended to predicted mutated CDRs in the exact same conformation as the wildtype, even when those mutations led to loss of antigen binding. So I ran an extreme version of this experiment and mutated all CDRs to glycine, and found that the conformations were still the same (less than 1 Å CA RMSD).</p>

          <img src="https://www.biorxiv.org/content/biorxiv/early/2025/05/15/2025.05.09.653228/F8.large.jpg" alt="Structure prediction neural networks specific for antibodies return memorized conformations when predicting the conformations of CDRs that have been entirely mutated to polyglycines." width="700" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />

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