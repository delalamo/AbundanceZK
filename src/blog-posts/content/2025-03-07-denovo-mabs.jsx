import React, { useRef } from 'react'; // Import useRef
// Import MathJax if needed (not used here)
// Import the hooks and component (adjust paths as needed)
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList'; // Ensure this has .jsx extension

// Define config specific to this post
const footnotesConfig = [
    // Use DOI where available, URL for book, placeholder/flag for PDF
    { id: 'fn1', doi: '10.1101/2024.03.14.585103' }, // Bennett et al
    { id: 'fn2', doi: '10.1038/s41586-023-06415-8' }, // Watson et al
    { id: 'fn3', doi: '10.1038/s41586-024-07487-w' }, // Abramson et al
    { id: 'fn4', isbn: '9780815336426' }, // Janeway et al (Book URL - might work partially)
    { id: 'fn5', doi: '10.1080/19420862.2020.1729683' }, // Rees
    { id: 'fn6', doi: '10.1016/j.immuni.2022.03.019' }, // Wang et al
    { id: 'fn7', doi: '10.1126/science.add2187' },   // Dauparas et al
    { id: 'fn8', manualHtml: 'del Alamo, B., et al. (2024). Antibody CDR design by ensembling inverse folding with protein language models. <i>PEGS Boston Summit</i>. <a href="https://cdn-api.swapcard.com/public/files/caa2cb897fb3417c8ebb6aa210abf28d.pdf" target="_blank" rel="noopener noreferrer">[Presentation PDF]</a>' }, // del Alamo et al (PDF - citation-js cannot fetch)
    { id: 'fn9', doi: '10.1101/2024.03.26.586756' }, // Chinnery et al
];

export const post = {
  id: '2025-03-07-antibody-design',
  title: 'Antibody design de novo vs in vivo',
  date: '2025-03-07',
  category: 'Bio/ML',
  excerpt: 'The Baker lab tackles de novo antibody design by narrowing the problem as much as possible.',
  content: (() => {
    // Component function to use hooks
    const ContentComponent = () => {
      const contentRef = useRef(null);

      // Use the custom hooks
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      // Choose citation style via formatOptions (e.g., 'apa', 'vancouver')
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' });

      return (
        <div className="content-container" ref={contentRef}>
          {/* Main blog post JSX content goes here... */}
          {/* Ensure <sup class="footnote-ref">[<a href="#fnX" id="fnrefX"></a>]</sup> structure is used */}
           <p>The Baker lab tackles <em>de novo</em> antibody design by narrowing the problem as much as possible.</p>

           <p>Last week saw a sizable update to the RF-antibody preprint<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup> as well as the release of its source code. RF-antibody repurposed the backbone design model RF-diffusion<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup> to create single-chain antibodies that bound with some success to some previously validated targets, such as toxin B from <em>C. difficile</em> and hemagglutinin from influenza. Coming less than one year after the publication of vanilla RF-diffusion, the project initially made a considerable splash, and coincided with the announcement of a <a href="https://www.fiercebiotech.com/biotech/new-ai-drug-discovery-powerhouse-xaira-rises-1b-funding">spin-off startup</a>, which hired the researchers behind the report. Whereas the first version focused only on VHHs, The updated version includes details on the design of single-chain variable fragment (scFvs), some retrospective binder validation with AlphaFold3<sup className="footnote-ref">[<a href="#fn3" id="fnref3"></a>]</sup>, and most importantly, the source code.</p>

           <p>Looking back on the preprint, it's clear that some of the success can be attributed to how the authors managed to constrain the problem of <em>de novo</em> antibody design, which is defined by the huge number of potentially viable sequences (estimates put it as high 10<sup>18</sup> possible antibodies<sup className="footnote-ref">[<a href="#fn4" id="fnref4"></a>,<a href="#fn5" id="fnref5"></a>]</sup>). The adaptive immune systems of jawed vertebrates navigate this space using something akin to a combination of high-throughput screening and directed evolution: infection exposes the antigen(s) to millions or billions of naive germline antibodies that vary in chain and CDR composition, and successful binders are then affinity-matured in a Darwinian process called somatic hypermutation. In effect, this system constrains the problem by limiting the search to promising germline lineages that already bind to their target, and the fact that nearly identical antibodies routinely show up in different humans attests to the influence these constraints have on the outcome<sup className="footnote-ref">[<a href="#fn6" id="fnref6"></a>]</sup>.</p>

           <p>Now contrast this with RF-antibody, which limits the antibody design problem by massively reducing the number of design parameters. Whereas natural germlines have different sequence compositions and CDR lengths, RF-antibody exclusively tests VHHs and scFvs with one hand-picked framework each (h-NbBcII10FGLA and trastuzumab/Herceptin, respectively) and a fixed set of CDR lengths. The users then pre-specify the epitope, leaving the algorithm to sort out docking, CDR conformation design, and CDR sequence design. Their workflows couples the first two of these steps, which were the attention-getting steps from the workflow, while leaving the third for later.</p>

           <p>It is at this third step that the sequence space can be more thoroughly explored than what would ordinarily happen in the immune system. Their sequence design method of choice, ProteinMPNN<sup className="footnote-ref">[<a href="#fn7" id="fnref7"></a>]</sup>, tends to design CDR sequences that look nothing like antibodies<sup className="footnote-ref">[<a href="#fn8" id="fnref8"></a>]</sup> (we have a preprint coming out soon that goes into more detail about this). On the one hand, this simplifies the problem considerably since only the residues in the CDRs are being designed. On the other hand, it massively expands the search space, as ProteinMPNN designs CDRs that aren't constrained by the processes defining our adaptive immune systems<sup className="footnote-ref">[<a href="#fn9" id="fnref9"></a>]</sup>. The authors acknowledge as much, stating in their discussion that "designing sequences that more closely match human CDR sequences would be expected to reduce the potential immunogenicity and developability". In any case, if the authors intended for this pipeline to be a minimum viable product, then they succeeded at that by identifying binders in the first place, and can now tackle the harder problem of turning them into drugs. I suspect that, as the brakes are applied to ProteinMPNN during CDR sequence design in service of that objective, the reduction in diversity will be counterbalanced by considering other frameworks and CDR lengths. Over time, this may result in a broader pool of potential binders more reflective of what the human adaptive immune system is capable of producing.</p>


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