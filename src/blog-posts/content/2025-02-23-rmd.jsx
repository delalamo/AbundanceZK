import React from 'react';

export const post = {
  id: '2025-02-24-low-dim-md',
  title: 'Low-dimensional representations of MD simulations',
  date: '2025-02-24',
  category: 'Bio/ML',
  excerpt: 'Autoencoders, a type of neural network that learns how to optimally compress information, share some superficial resemblances to collective variables (CVs) used in MD simulations.',
  content: (
    <>
      <p>Autoencoders, a type of neural network that learns how to optimally compress information, share some superficial resemblances to collective variables (CVs) used in MD simulations.</p>

      <p>In the latter case, though, humans usually have to hunt for informative movements, and then get ignore everything else. High-quality CVs reduce high-dimensional processes being simulated to just a few features, such as backbone or side chain torsion angles or distances, placing the focus on the system's propensity to sample different substates as a function of such features. This improves interpretability at the cost of comprehensiveness. Here's an example from a recent paper on acceleration of MD simulations<sup>[<a href="#fn1" id="fnref1">1</a>]</sup>:</p>

      <img
        src="/assets/post_images/2025_02_24_A.png"
        alt="Example of collective variables in FGFR2"
        width="700"
        style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }}
      />
      <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
          <span style={{ fontStyle: 'italic' }}>Figure from </span><sup>[<a href="#fn1" id="fnref1_fig1">1</a>]</sup>
      </p>

      <p>Now contrast that with autoencoders, which have the advantage of compressing far more information to a low-dimensional representation (termed the latent space), without necessarily needing to be human-interpretable.</p>

       <img
        src="/assets/post_images/2025_02_24_B.png"
        alt="Figure from the encodermap paper showing how different conformations of a small protein are colocalized in the two-dimensional space of an autoencoder"
        width="700"
        style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }}
      />
      <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
          <span style={{ fontStyle: 'italic' }}>Figure from </span><sup>[<a href="#fn2" id="fnref2_fig2">2</a>]</sup>
      </p>

      <p>In the context of MD, autoencoders are nothing new: they've been used to learn simplified representations of more complex, generally nonlinear systems<sup>[<a href="#fn2" id="fnref2">2</a>,<a href="#fn3" id="fnref3">3</a>,<a href="#fn4" id="fnref4">4</a>]</sup>. In one example from the Baker group, the protein folding neural network RosettaFold was fine-tuned with a 256-dimension autoencoder exclusively on the protein Ras<sup>[<a href="#fn5" id="fnref5">5</a>]</sup>. The method worked, in that it successfully sampled conformations unseen during training from this latent space, but at the cost of being uninterpretable given its huge latent space.</p>

      <p>I haven’t found an example that attempts to directly link the comprehensiveness of an autoencoder's latent representation to the interpretability of human-identified CVs until last week<sup>[<a href="#fn6" id="fnref6">6</a>]</sup>. In that preprint by authors Kolossváry & Coffey, an autoencoder was trained to both recover structure and organize its latent space to match human-picked CVs. This allowed the authors to both visualize the protein's free energy landscape and generate putative transition paths from the autoencoder's latent space. In practice, the approach reconstructed CRBN's conformational change to an impressive accuracy of 1.6 angstroms RMSD (compared to 1.2 angstroms when the link with hand-picked CVs was excluded).</p>

       <img
        src="/assets/post_images/2025_02_24_C.png"
        alt="Overall scheme of the autoencoder used by Kolossváry & Coffey in their preprint on reinforced MD"
        width="700" // Consistent width
        style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }}
       />
      <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
          <span style={{ fontStyle: 'italic' }}>Figure from </span><sup>[<a href="#fn6" id="fnref6_fig3">6</a>]</sup>
      </p>

      <p>Interestingly, this architecture, despite being presented in a paper mentioning protein folding neural networks like AlphaFold2 and RosettaFold, doesn't seem to incorporate any of their advancements. For instance, the challenge of rotational and translational invariance, which was solved by the former using their structure module<sup>[<a href="#fn7" id="fnref7">7</a>]</sup>, the latter using an SE(3)-transformer<sup>[<a href="#fn8" id="fnref8">8</a>]</sup>, and ignored altogether by AlphaFold3 and its derivatives<sup>[<a href="#fn9" id="fnref9">9</a>]</sup>, gets lazily addressed by learning exclusively from poses that have been aligned to a common reference frame. They also use RMSD loss, rather than FAPE loss which has been shown to permit more stable training on biomolecular structures<sup>[<a href="#fn10" id="fnref10">10</a>]</sup>.</p>

      <p>None of the three applications that I envisioned for such a tool are discussed. First, the authors focus solely on CRBN, and do not mention the emergence of cryptic pockets that often trigger the use of MD in the first place. Second, only the wildtype system is simulated; the method could be useful in comparing how well a missense mutation retains or disrupts a protein's dynamics. Third, there is no evidence to suggest that the global latent space at all reflects the transition dynamics in complex systems, such as fold-switching proteins. So although I'm excited about the method, probably we need to see more before judging its extensibility and whether it can be further improved.</p>

      <p><em>This post was prepared with the help of Gemini 2.0 Flash</em></p>

      <section className="footnotes">
        <hr />
        <ol>
          <li id="fn1">Schönherr et al. <a href="https://doi.org/10.1073/pnas.2317756121">"Discovery of lirafugratinib (RLY-4008), a highly selective irreversible small-molecule inhibitor of FGFR2"</a> PNAS 2024 <a href="#fnref1" title="Jump back to footnote 1 in the text">↩</a></li>
          <li id="fn2">Lemke & Peter <a href="https://doi.org/10.1021/acs.jctc.8b00975">"EncoderMap: Dimensionality reduction and generation of molecule conformations"</a> JCTC 2019 <a href="#fnref2" title="Jump back to footnote 2 in the text">↩</a></li>
          <li id="fn3">Wehmeyer & Noé <a href="https://doi.org/10.1063/1.5011399">"Time-lagged autoencoders: Deep learning of slow collective variables for molecular kinetics"</a> J Chem Phys 2018 <a href="#fnref3" title="Jump back to footnote 3 in the text">↩</a></li>
          <li id="fn4">Vani et al. <a href="https://doi.org/10.1021/acs.jcim.3c01436">"Exploring kinase asp-phe-gly (DFG) loop conformational stability with AlphaFold2-RAVE"</a> JCIM 2023 <a href="#fnref4" title="Jump back to footnote 4 in the text">↩</a></li>
          <li id="fn5">Mansoor et al. <a href="https://doi.org/10.1021/acs.jctc.3c01057">"Protein ensemble generation through variational autoencoder latent space sampling"</a> JCTC 2024 <a href="#fnref5" title="Jump back to footnote 5 in the text">↩</a></li>
          <li id="fn6">Kolossváry & Coffey <a href="https://doi.org/10.1101/2025.02.12.638002">"Reinforced molecular dynamics: Physics-infused generative machine learning model explores CRBN activation process"</a> biorxiv 2025 <a href="#fnref6" title="Jump back to footnote 6 in the text">↩</a></li>
          <li id="fn7">Jumper et al. <a href="https://doi.org/10.1038/s41586-021-03819-2">"Highly accurate protein structure prediction with AlphaFold"</a> Nature 2021 <a href="#fnref7" title="Jump back to footnote 7 in the text">↩</a></li>
          <li id="fn8">Baek et al. <a href="https://doi.org/10.1126/science.abj8754">"Accurate prediction of protein structures and interactions using a three-track neural network"</a> Science 2021 <a href="#fnref8" title="Jump back to footnote 8 in the text">↩</a></li>
          <li id="fn9">Abramson et al. <a href="https://doi.org/10.1038/s41586-024-07487-w">"Accurate structure prediction of biomolecular interactions with AlphaFold 3"</a> Nature 2024 <a href="#fnref9" title="Jump back to footnote 9 in the text">↩</a></li>
          <li id="fn10">Baek et al. <a href="https://doi.org/10.1101/2023.05.24.542179">"Efficient and accurate prediction of protein structure using RoseTTAFold2"</a> biorxiv 2023 <a href="#fnref10" title="Jump back to footnote 10 in the text">↩</a></li>
        </ol>
      </section>
    </>
  ),
};