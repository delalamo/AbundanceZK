// src/blog-posts/content/2025-02-13-nanobody-cdr3-prediction.jsx
import React from 'react';
// No MathJax needed

export const post = {
  id: '2025-02-13-nanobody-cdr3-prediction', // Generated ID
  title: 'Nanobody CDR3 structure prediction', // From frontmatter
  date: '2025-02-13', // From frontmatter
  category: 'Bio/ML', // As requested
  excerpt: "Four years after the protein folding problem was allegedly solved, we still can't reliably predict how or where antibodies bind to their antigens. A recent report identifies one source of continued difficulty.", // First paragraph
  content: (
    <>
      <p>Four years after the protein folding problem was allegedly solved, we still can't reliably predict how or where antibodies bind to their antigens. A recent report identifies one source of continued difficulty.</p>

      {/* Note: Interpreting [n] as footnote/reference markers */}
      <p>Nanobodies are single-domain antibodies used as clinical therapeutics and experimental reagents for tasks such as bulking up protein structures for cryo-EM<sup>[<a href="#fn1" id="fnref1">1</a>]</sup>. Despite their smaller size, they share the same difficulties as traditional antibodies when it comes to structure prediction, namely the inability to reliably predict how and where they bind their targets, with success rates ranging in the 33-50% range<sup>[<a href="#fn2" id="fnref2">2</a>,<a href="#fn3" id="fnref3">3</a>]</sup>. A report published last week<sup>[<a href="#fn4" id="fnref4">4</a>]</sup> identifies a major determinant of whether the binding mode is correctly predicted: the "kink" or bend found in many CDR3 loops that is also found in most human antibodies<sup>[<a href="#fn5" id="fnref5">5</a>]</sup>. The recent structure prediction tool AlphaFold3 correctly docked nanobodies to their antigens nearly 80% of the time when the CDR3 conformation was extended, but barely 25% of the time when it was kinked.</p>

      {/* Image 1 with specific width and caption */}
      <p style={{ textAlign: 'center' }}>
        <img
            src="/assets/post_images/2025_02_09_A.png"
            alt="Kinked CDR3 loops are more difficult to predict than extended loops"
            width="600" // Specific width from {: width="400px" }
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto', maxWidth: '100%' }}
         />
      </p>
      <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
            <span style={{ fontStyle: 'italic' }}>Figure from </span><sup>[<a href="#fn4" id="fnref4_fig2">4</a>]</sup>
        </p>

      <p>Fortunately, these models were effective at predicting whether the kink was there or not.</p>

      {/* Image 2 with default width and caption */}
       <p style={{ textAlign: 'center' }}>
        <img
            src="/assets/post_images/2025_02_09_B.png"
            alt="CDR3 conformation is mostly correctly predicted by AlphaFold2 and AlphaFold3"
            width="400" // Default width
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto', maxWidth: '100%' }}
         />
      </p>
        <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
            <span style={{ fontStyle: 'italic' }}>Figure from </span><sup>[<a href="#fn4" id="fnref4_fig2">4</a>]</sup>
        </p>

      <p>In any case, whether that observation extends to human paired antibodies, the structures of which are more difficult to predict<sup>[<a href="#fn6" id="fnref6">6</a>]</sup>, remains to be seen.</p>

      {/* Using 'footnotes' class for consistency, treating numbered list as refs */}
      <section className="footnotes">
        <hr />
        <ol>
          {/* Note: Brackets removed from titles. Added backlink refs. */}
          <li id="fn1">Wu, Xudong. <a href="https://doi.org/10.1016/j.tibs.2024.06.002">"Nanobody-assisted cryoEM structural determination for challenging proteins"</a> Trends in Biochemical Sciences 2024 <a href="#fnref1" title="Jump back to footnote 1 in the text">↩</a></li>
          <li id="fn2">Abramson, Josh, <em>et al.</em> <a href="https://doi.org/10.1038/s41586-024-07487-w">"Accurate structure prediction of biomolecular interactions with AlphaFold3"</a> Nature 2024 <a href="#fnref2" title="Jump back to footnote 2 in the text">↩</a></li>
          <li id="fn3">Hitawala, Fatima N. and Gray, Jeffrey J. <a href="https://doi.org/10.1101/2024.09.21.614257">"What has AlphaFold3 learned about antibody and nanobody docking, and what remains unsolved?"</a> Biorxiv 2024 <a href="#fnref3" title="Jump back to footnote 3 in the text">↩</a></li>
          <li id="fn4">Eshak, Floriane and Goupil-Lamy, Anne. <a href="https://doi.org/10.1021/acs.jcim.4c01877">"Advancements in nanobody epitope prediction: A comparative study of AlphaFold2Multimer vs AlphaFold3"</a> JCIM 2025 <a href="#fnref4" title="Jump back to footnote 4 in the text">↩</a></li>
          <li id="fn5">Weitzner, Brian D. and Dunbrack, Roland L. and Gray, Jeffrey J. <a href="https://doi.org/10.1016/j.str.2014.11.010">"The origin of CDR H3 structural diversity"</a> Structure 2015 <a href="#fnref5" title="Jump back to footnote 5 in the text">↩</a></li>
          <li id="fn6">Greenshields-Watson, <em>et al.</em> <a href="https://doi.org/10.1016/j.sbi.2025.102983">"Challenges and compromises: Predicting unbound antibody structures with deep learning"</a> Current Opinion in Structural Biology 2025 <a href="#fnref6" title="Jump back to footnote 6 in the text">↩</a></li>
        </ol>
      </section>
    </>
  ),
};