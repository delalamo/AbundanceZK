// src/blog-posts/content/2025-02-14-antibody-evolution-observations.jsx
import React from 'react';
// No MathJax needed

export const post = {
  id: '2025-02-14-antibody-evolution-observations', // Generated ID
  title: 'Observations on how antibodies evolve', // From frontmatter
  date: '2025-02-14', // From frontmatter
  category: 'Bio/ML', // As requested
  excerpt: 'A recent study on anti-SARS-CoV-2 antibodies retraces the steps they take during affinity maturation.', // First paragraph
  content: (
    <>
      <p>A recent study on anti-SARS-CoV-2 antibodies retraces the steps they take during affinity maturation.</p>

      <p>Antibodies evolve differently from most proteins. Instead of maintaining functions and/or interactions across different organisms, antibodies evolve specificity to targets of interest within organisms, in a Darwinian process called somatic hypermutation. During this process, they collect point mutations that increase their affinity to their target, with the end result being a slightly modified antibody sequence that binds with nanomolar or picomolar affinity and (usually) very high specificity.</p>

      {/* Handle inline link */}
      <p><a href="https://doi.org/10.1073/pnas.2412787122">Kirby et al</a> recently examined the evolutionary trajectories taken by fourteen high-affinity antibodies to see what the overall effect of each mutation was, relative to the germline precursor. Their results are quite interesting and are summarized as follows:</p>

      {/* Handle bulleted list */}
      <ul>
        <li>The mutations obtained during affinity maturation can be obtained in any order, arguing that epistasis is not a problem.</li>
        <li>Most mutations (47 out of 51) are the result of single-nucleotide changes, suggesting that the DNA sequence of the germline introduces a hard constraint on the accessible evolutionary space.</li>
        <li>Germline precursors to high-affinity antibodies already bind with nanomolar affinity, and most mutations obtained during affinity maturation don't actually improve on this</li>
        <li>More evolutionary "steps" are required for germline antibodies to evolve to broadly neutralizing antibodies that can bind to many different variants of SARS-CoV-2</li>
      </ul>

      <p>Incidentally, this is the first time I used an LLM to find a paper - I asked Gemini to find a citation for the claim that germline antibodies can already have nanomolar binding affinity to their targets, and it replied with this paper.</p>

      {/* Use the same section structure for consistency, even if not strictly footnotes */}
      <section className="footnotes">
        <hr />
        {/* Use ordered list for numbered references */}
        <ol>
          {/* Note: Brackets removed from title. No backlink needed as no marker in text. */}
          <li>Kirby et al. <a href="https://doi.org/10.1073/pnas.2412787122">"Retrospective SARS-CoV-2 human antibody development trajectories are largely sparse and permissive"</a> PNAS 2025</li>
        </ol>
      </section>
    </>
  ),
};