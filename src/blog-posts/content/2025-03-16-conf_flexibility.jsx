import React from 'react';

export const post = {
  id: '2025-03-14-conf-sampling',
  title: 'Training data for conformational flexibility prediction',
  date: '2025-03-14',
  category: 'Bio/ML',
  excerpt: 'How much data from molecular dynamics simulations are needed to predict protein flexibility?',
  content: (
    <>
      <p>How much data from molecular dynamics simulations are needed to predict protein flexibility?</p> 

      <p>The loadedness of the term "protein dynamics" complicates many attempts at figuring out what scientists want exactly when using modern AI/ML tools to predict protein structural heterogeneity. For the two to three years when AlphaFold2 and related methods were the state of the art, modeling dynamics mostly meant hacking these methods to yield some conformational heterogeneity<sup>[<a href="#fn1" id="fnref1">1</a>]</sup>. In the last year and a half or so, however, several high-quality neural networks have been released that tackle this problem more directly, at various levels of comprehensiveness: AlphaFlow<sup>[<a href="#fn2" id="fnref2">2</a>]</sup>, BioEmu<sup>[<a href="#fn3" id="fnref3">3</a>]</sup>, and Str2str<sup>[<a href="#fn4" id="fnref4">4</a>]</sup> being some examples.</p>

      <p>In general it seems that two types of neural networks have emerged to fill this gap. The first learns from simulation data for individual proteins and attempts to, in effect, learn fundamental properties about those systems by interpolating them (example <a href="https://delalamo.xyz/post/2025-02-24-low-dim-md">here</a>). The second try to be more generalist, and learn from huge quantities of structural and MD data.</p>

      <p>Earlier this week a preprint was released that attempts to do the second<sup>[<a href="#fn7" id="fnref7">7</a>]</sup>. The method, sAMt, uses a variational autoencoder and an input structure as a template to model proteins heterogeneity from sequence alone.</p>

      <img
        src="/assets/post_images/2025_03_14_A.png"
        alt="Overview of the network from Janson et al"
        width="700"
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          height: 'auto'
        }}
      />

      <p>There are many things to like about this preprint - unlike the method I discussed before, it uses more modern neural network architectures such as the AlphaFold structure module<sup>[<a href="#fn8" id="fnref8">8</a>]</sup> and diffusion models, as well as the frame aligned point error loss function. But one thing stood out in this document that warrants further discussion:</p>

      <blockquote>
      <p>"...free energy values from aSAMt were not in accurate quantitative agreement with the long MD results indicating that aSAMt learned the extent of conformational sampling covering a broad range of conformations but struggles in correctly reproducing relative probabilities between different states . This result may be expected, since the training data from mdCATH were simulations at most 500 ns long with few transitions between alternate states at a given temperature from which relative probabilities could have been learned..."</p>
      </blockquote>

      <p>In contrast, the long MD simulations against which the conformers are compared last one or more milliseconds<sup>[<a href="#fn9" id="fnref9">9</a>]</sup>. That's approximately 2,000 longer than the training examples. Moreover, the modeled proteins were explicitly chosen for their ability to quickly fold and unfold, suggesting a degree of comprehensiveness in the simulations. In contrast, the proteins in mdCATH are simply short simulations of a cross-section of structural diversity<sup>[<a href="#fn10" id="fnref10">10</a>]</sup>.</p>

      <p>This point has been raised in the past in verbal discussions on AlphaFlow. The motions captured in mdCATH are, in effect, Brownian motion, which is neither difficult nor interesting to predict. The value added by a neural network capable of predicting certain properties of protein dynamics would come from, at a minimum, a capacity to predict the weighted distribution of different conformations. Thus far, BioEmu is the closest to achieving this, although its accurate predictions are limited to conformational breadth and folded versus unfolded states. That said, there's no reason that further progress in this field will unlock this capability to learn from the short MD simulations we have available.</p>

      <section className="footnotes"> 
        <hr /> 
        <ol>
          <li id="fn1">Sala et al <a href="https://doi.org/10.1016/j.sbi.2023.102645">"Modeling conformational states of proteins with AlphaFold"</a> Curr Opin Struct Biol 2023 <a href="#fnref1" title="Jump back to footnote 1 in the text">↩</a></li>
          <li id="fn2">Lewis et al <a href="https://doi.org/10.1101/2024.12.05.626885">"Scalable emulation of protein equilibrium ensembles with generative deep learning"</a> biorxiv 2024 <a href="#fnref2" title="Jump back to footnote 2 in the text">↩</a></li>
          <li id="fn3">Jing et al <a href="https://doi.org/10.48550/arXiv.2402.04845">"AlphaFold Meets Flow Matching for Generating Protein Ensembles"</a> ICML 2024 <a href="#fnref3" title="Jump back to footnote 3 in the text">↩</a></li>
          <li id="fn4">Lu et al <a href="https://doi.org/10.48550/arXiv.2306.03117">"Str2Str: A Score-based Framework for Zero-shot Protein Conformation Sampling"</a> ICLR 2024 <a href="#fnref4" title="Jump back to footnote 4 in the text">↩</a></li>
          <li id="fn5">Vani et al <a href="https://doi.org/10.1021/acs.jcim.3c01436">"Exploring Kinase Asp-Phe-Gly (DFG) Loop Conformational Stability with AlphaFold2-RAVE"</a> JCIM 2023 <a href="#fnref5" title="Jump back to footnote 5 in the text">↩</a></li>
          <li id="fn6">de Silva et al <a href="https://doi.org/10.1038/s41467-024-46715-9">"High-throughput prediction of protein conformational distributions with subsampled AlphaFold2"</a> Nature Comms 2024 <a href="#fnref6" title="Jump back to footnote 6 in the text">↩</a></li>
          <li id="fn7">Janson et al <a href="https://doi.org/10.1101/2025.03.09.642148">"Deep generative modeling of temperature-dependent structural ensembles of proteins"</a> biorxiv 2025 <a href="#fnref7" title="Jump back to footnote 7 in the text">↩</a></li>
          <li id="fn8">Jumper et al <a href="https://doi.org/10.1038/s41586-021-03819-2">"Highly accurate protein structure prediction with AlphaFold"</a> Nature 2021 <a href="#fnref8" title="Jump back to footnote 8 in the text">↩</a></li>
          <li id="fn9">Lindorff-Larson et al <a href="https://doi.org/10.1126/science.1208351">"How fast-folding proteins fold"</a> Science 2011 <a href="#fnref9" title="Jump back to footnote 9 in the text">↩</a></li>
          <li id="fn10">Mirarchi et al <a href="https://doi.org/10.1038/s41597-024-04140-z">"mdCATH: A Large-Scale MD Dataset for Data-Driven Computational Biophysics"</a> Scientific Data 2024 <a href="#fnref10" title="Jump back to footnote 10 in the text">↩</a></li>
        </ol>
      </section>
    </>
  ),
};
