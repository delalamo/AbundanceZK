// src/blog-posts/content/2025-03-07-antibody-design.jsx
import React from 'react';

export const post = {
  id: '2025-03-07-antibody-design', // Generated ID based on date and title
  title: 'Antibody design de novo vs in vivo', // From frontmatter
  date: '2025-03-07', // From frontmatter date field
  category: 'Bio/ML', // As requested
  excerpt: 'The Baker lab tackles de novo antibody design by narrowing the problem as much as possible.', // First paragraph
  content: (
    <>
      <p>The Baker lab tackles <em>de novo</em> antibody design by narrowing the problem as much as possible.</p>

      <p>Last week saw a sizable update to the RF-antibody preprint<sup><a href="#fn1" id="fnref1">1</a></sup> as well as the release of its source code. RF-antibody repurposed the backbone design model RF-diffusion<sup><a href="#fn2" id="fnref2">2</a></sup> to create single-chain antibodies that bound with some success to some previously validated targets, such as toxin B from <em>C. difficile</em> and hemagglutinin from influenza. Coming less than one year after the publication of vanilla RF-diffusion, the project initially made a considerable splash, and coincided with the announcement of a <a href="https://www.fiercebiotech.com/biotech/new-ai-drug-discovery-powerhouse-xaira-rises-1b-funding">spin-off startup</a>, which hired the researchers behind the report. Whereas the first version focused only on VHHs, The updated version includes details on the design of single-chain variable fragment (scFvs), some retrospective binder validation with AlphaFold3<sup><a href="#fn3" id="fnref3">3</a></sup>, and most importantly, the source code.</p>

      <p>Looking back on the preprint, it's clear that some of the success can be attributed to how the authors managed to constrain the problem of <em>de novo</em> antibody design, which is defined by the huge number of potentially viable sequences (estimates put it as high 10<sup>18</sup> possible antibodies<sup><a href="#fn4" id="fnref4">4</a>,<a href="#fn5" id="fnref5">5</a></sup>). The adaptive immune systems of jawed vertebrates navigate this space using something akin to a combination of high-throughput screening and directed evolution: infection exposes the antigen(s) to millions or billions of naive germline antibodies that vary in chain and CDR composition, and successful binders are then affinity-matured in a Darwinian process called somatic hypermutation. In effect, this system constrains the problem by limiting the search to promising germline lineages that already bind to their target, and the fact that nearly identical antibodies routinely show up in different humans attests to the influence these constraints have on the outcome<sup><a href="#fn6" id="fnref6">6</a></sup>.</p>

      <p>Now contrast this with RF-antibody, which limits the antibody design problem by massively reducing the number of design parameters. Whereas natural germlines have different sequence compositions and CDR lengths, RF-antibody exclusively tests VHHs and scFvs with one hand-picked framework each (h-NbBcII10FGLA and trastuzumab/Herceptin, respectively) and a fixed set of CDR lengths. The users then pre-specify the epitope, leaving the algorithm to sort out docking, CDR conformation design, and CDR sequence design. Their workflows couples the first two of these steps, which were the attention-getting steps from the workflow, while leaving the third for later.</p>

      <p>It is at this third step that the sequence space can be more thoroughly explored than what would ordinarily happen in the immune system. Their sequence design method of choice, ProteinMPNN<sup><a href="#fn7" id="fnref7">7</a></sup>, tends to design CDR sequences that look nothing like antibodies<sup><a href="#fn8" id="fnref8">8</a></sup> (we have a preprint coming out soon that goes into more detail about this). On the one hand, this simplifies the problem considerably since only the residues in the CDRs are being designed. On the other hand, it massively expands the search space, as ProteinMPNN designs CDRs that aren't constrained by the processes defining our adaptive immune systems<sup><a href="#fn9" id="fnref9">9</a></sup>. The authors acknowledge as much, stating in their discussion that "designing sequences that more closely match human CDR sequences would be expected to reduce the potential immunogenicity and developability". In any case, if the authors intended for this pipeline to be a minimum viable product, then they succeeded at that by identifying binders in the first place, and can now tackle the harder problem of turning them into drugs. I suspect that, as the brakes are applied to ProteinMPNN during CDR sequence design in service of that objective, the reduction in diversity will be counterbalanced by considering other frameworks and CDR lengths. Over time, this may result in a broader pool of potential binders more reflective of what the human adaptive immune system is capable of producing.</p>

      <section className="footnotes">
        <hr />
        <ol>
          <li id="fn1">Bennett et al, <a href="https://doi.org/10.1101/2024.03.14.585103">"Atomically accurate de novo design of antibodies with RFdiffusion"</a> biorxiv 2024 <a href="#fnref1" title="Jump back to footnote 1 in the text">↩</a></li>
          <li id="fn2">Watson et al, <a href="https://doi.org/10.1038/s41586-023-06415-8">"De novo design of protein structure and function with RFdiffusion"</a> Nature 2023 <a href="#fnref2" title="Jump back to footnote 2 in the text">↩</a></li>
          <li id="fn3">Abramson et al, <a href="https://doi.org/10.1038/s41586-024-07487-w">"Accurate structure prediction of biomolecular interactions with AlphaFold 3"</a> Nature 2024 <a href="#fnref3" title="Jump back to footnote 3 in the text">↩</a></li>
          <li id="fn4">Janeway et al, <a href="https://www.ncbi.nlm.nih.gov/books/NBK10775/">"Immunobiology: The Immune System in Health and Disease (5th edition)"</a> Garland Science 2001 <a href="#fnref4" title="Jump back to footnote 4 in the text">↩</a></li>
          <li id="fn5">Rees, <a href="https://doi.org/10.1080/19420862.2020.1729683">"Understanding the human antibody repertoire"</a> mAbs 2019 <a href="#fnref5" title="Jump back to footnote 5 in the text">↩</a></li>
          <li id="fn6">Wang et al, <a href="https://doi.org/10.1016/j.immuni.2022.03.019">"A large-scale systematic survey reveals recurring molecular features of public antibody responses to SARS-CoV-2"</a> Immunity 2022 <a href="#fnref6" title="Jump back to footnote 6 in the text">↩</a></li>
          {/* Note: Corrected the malformed DOI link from the original markdown for footnote 7 */}
          <li id="fn7">Dauparas et al, <a href="https://doi.org/10.1126/science.add2187">“Robust deep learning-based protein sequence design using ProteinMPNN”</a> Science 2022 <a href="#fnref7" title="Jump back to footnote 7 in the text">↩</a></li>
          <li id="fn8">del Alamo et al, <a href="https://cdn-api.swapcard.com/public/files/caa2cb897fb3417c8ebb6aa210abf28d.pdf">"Antibody CDR design by ensembling inverse folding with protein language models"</a> PEGS Boston 2024 <a href="#fnref8" title="Jump back to footnote 8 in the text">↩</a></li>
          <li id="fn9">Chinnery et al, <a href="https://doi.org/10.1101/2024.03.26.586756">"Baselining the Buzz Trastuzumab-HER2 Affinity, and Beyond"</a> biorxiv 2024 <a href="#fnref9" title="Jump back to footnote 9 in the text">↩</a></li>
        </ol>
      </section>
    </>
  ),
};