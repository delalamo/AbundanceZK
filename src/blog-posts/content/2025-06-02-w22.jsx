import { useRef } from 'react';

import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';
import MolstarViewer from '../../components/MolstarViewer'; 

const footnotesConfig = [
    { id: 'fn1', doi: '10.1101/2023.12.07.570727' },
    { id: 'fn2', doi: '10.1016/j.cels.2023.10.002' },
    { id: 'fn3', doi: '10.1101/2024.01.30.577970' },
    { id: 'fn4', doi: '10.48550/arXiv.2504.16886' },
    { id: 'fn5', doi: '10.48550/arXiv.2312.00080' },
    { id: 'fn6', doi: '10.1101/2024.06.15.599145' },
    { id: 'fn7', manualHtml: 'Presentation by Paolo Marcatili at PEGS Europe, 2024. He showed that subtracting antibody structure-based sequence design predictions from the unbound state led to design of higher-affinity designs.' },
    { id: 'fn8', doi: '10.1101/2025.05.20.655154' },
    { id: 'fn9', doi: '10.1126/science.adr7094' },
    { id: 'fn10', doi: '10.1101/2025.02.03.636309' },
    { id: 'fn11', doi: '10.1101/2025.04.30.651414' },
    { id: 'fn12', doi: '10.1002/pro.4653' },
    { id: 'fn13', doi: '10.57844/arcadia-570f-5cfb' },
    { id: 'fn14', doi: '10.1126/science.adq1741' },
    { id: 'fn15', doi: '10.1101/2024.09.30.615802 ' },
    { id: 'fn16', doi: '10.1101/2025.05.25.655997' },

    



];

export const post = {
  id: '2025-06-02-zk',
  title: '2025 week 22 updates',
  date: '2025-06-02',
  category: 'Zettelkasten updates',
  excerpt: 'Zero-shot fitness prediction, design of conformational flexibility and protein binders, and PPI structure prediction.',
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
          
          <h4>Zero-shot variant effect prediction can be improved by averaging predictions from many orthologs</h4>
          <p>Zero-shot prediction of point mutants using language and/or inverse folding models is nothing new<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup>. A lot has been written about how model scaling of sequence-based models fails to translate to greater prediction<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>, <a href="#fn3" id="fnref3"></a>]</sup>, as well as how structure-based models excel at binding and stability prediction but underperform at other types of fitness<sup className="footnote-ref">[<a href="#fn4" id="fnref4"></a>, <a href="#fn5" id="fnref5"></a>]</sup>. An advantage of using inverse folding models is that several mathematical modifications have been proposed to improve prediction quality without necessarily retraining the model<sup className="footnote-ref">[<a href="#fn6" id="fnref6"></a>, <a href="#fn7" id="fnref7"></a>]</sup>. Last week, Pugh et al proposed one quick fix for protein language models: average predictions across many orthologous sequences (that is, sequences encoding the same protein in different species)<sup className="footnote-ref">[<a href="#fn8" id="fnref8"></a>]</sup>. Empirically, this works quite well, presumably because it is able to marginalize over sequence-specific memorization that larger models in particular tend to be quite vulnerable to.</p>

          <img src="/assets/post_images/2025_06_02/2025_06_02_A.png" alt="Improving zero-shot prediction of point mutations with multi-species averaging." width="500" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />
          
          <h4><i>De novo</i> proteins can also have conformational equilibria that are affected by point mutations</h4>
          <p><i>De novo</i> designed proteins are generally presented as hyperstable, highly idealized sequences. Yet in a paper recently published in Science (and preprinted last year), Guo & colleagues showed that even these can be designed to have conformational equilibria that are sensitive to ligands and mutations, a staple of naturally occurring protein<sup className="footnote-ref">[<a href="#fn9" id="fnref9"></a>]</sup>.</p>

          <h4>PPIs with large buried surface area cannot be accurately modeled by modern all-atom structure prediction methods</h4>
          <p>There's no doubt that the latest batch of protein structure prediction methods are a step up from the previous generation of protein-only neural networks. However, several recent reports have shown that they area particularly prone to memorization when predicting the conformations of small molecules<sup className="footnote-ref">[<a href="#fn10" id="fnref10"></a>]</sup>, RNAs<sup className="footnote-ref">[<a href="#fn11" id="fnref11"></a>]</sup>, and conformations. Now, a new report shows a more troubling observation when predicting complexes involving molecular glues: these methods overwhelmingly fail at predicting complexes with large buried surface areas.</p>

          <img src="/assets/post_images/2025_06_02/2025_06_02_B.png" alt="All-atom protein structure prediction methods fail to accurately predict protein-protein interfaces with large buried surface area." width="500" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />

          <h4>Protein binder design by hallucination can be improved by reinterpreting predicted aligned error as an energy function</h4>
          <p>There's been a funny temptation among computational biologists to view the confidence metrics used by protein structure prediction methods as energy functions, even though they are only well calibrated for predicting model error and generally fail at design tasks<sup className="footnote-ref">[<a href="#fn12" id="fnref12"></a>, <a href="#fn13" id="fnref13"></a>]</sup>. That hasn't stopped hallucination-based design workflows from using them to make novel backbones, even if the sequences that come out of them don't express well<sup className="footnote-ref">[<a href="#fn14" id="fnref14"></a>, <a href="#fn15" id="fnref15"></a>]</sup>. In an attempt to improve hallucination-based protein backbone design, Nori et al 2025 revisit the pTM formula used in AlphaFold2, which is used by pipelines such as BindCraft, and refine it into something more in line with energy-based models<sup className="footnote-ref">[<a href="#fn16" id="fnref16"></a>]</sup>. This leads to broad improvements in both designability and design self-consistency of various protein binders relative to BindCraft.</p>

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