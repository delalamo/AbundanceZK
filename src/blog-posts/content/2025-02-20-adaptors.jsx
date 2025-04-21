import React from 'react';

export const post = {
  id: '2025-02-20-structural-adaptors',
  title: 'Structural adaptors for protein property prediction',
  date: '2025-02-20',
  category: 'Bio/ML',
  excerpt: "It's always tricky to choose which protein neural network to use for fine-tuning tasks.",
  content: (
    <>
      <p>It's always tricky to choose which protein neural network to use for fine-tuning tasks.</p>

      <p>Inverse folding neural networks like ProteinMPNN<sup>[<a href="#fn1" id="fnref1">1</a>]</sup> have the advantage of working with explicit protein structures, but don't leverage the huge sequence databases we have available, whereas the opposite is true for protein language models like ESM<sup>[<a href="#fn2" id="fnref2">2</a>]</sup>. Some methods, such as ESM-IF1<sup>[<a href="#fn3" id="fnref3">3</a>]</sup>, try to bridge the gap by predicting structures from sequence and training from those, but those predicted structures aren't as informative as experimental structures<sup>[<a href="#fn4" id="fnref4">4</a>]</sup>. In any case, it's clear that structure-based neural networks are best for zero-shot prediction of things like stability and protein-protein binding affinity prediction, whereas sequence-based neural networks are better at predicting things like catalytic activity and overall contribution to organismal fitness<sup>[<a href="#fn5" id="fnref5">5</a>]</sup>.</p>

      <p>A recent preprint by Li & Luo<sup>[<a href="#fn6" id="fnref6">6</a>]</sup> discusses a way to combine both types of neural networks when fine-tuning for protein property prediction. Their method, names SPURS, introduces the final embeddings from the structure-based neural network ProteinMPNN into each intermediate layer of ESM2, thereby passing on the advantages of that 3D information to the sequence-based model.</p>

      <img
        src="/assets/post_images/2025_02_20_A.png"
        alt="Overall setup of the SPURS neural network"
        width="700" // Consistent width
        style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }}
      />
      <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
            <span style={{ fontStyle: 'italic' }}>Figure from </span><sup>[<a href="#fn6" id="fnref6_fig1">6</a>]</sup>
        </p>

      <p>After fine-tuning this network on the mega-scale dataset by Tsuboyama et al<sup>[<a href="#fn7" id="fnref7">7</a>]</sup>, which measured nearly a million stability measurements across several hundred proteins, they end up with a state-of-the-art thermostability predictor. This beats ThermoMPNN, a fine-tuned version of ProteinMPNN trained on the same dataset<sup>[<a href="#fn8" id="fnref8">8</a>]</sup>, directly showing how adding the language model into the mix contributed to performance.</p>

      <img
        src="/assets/post_images/2025_02_20_B.png"
        alt="Performance of SPURS compared to its competitors on various datasets"
        width="700" // Consistent width
        style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }}
      />
      <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
          <span style={{ fontStyle: 'italic' }}>Figure from </span><sup>[<a href="#fn6" id="fnref6_fig1">6</a>]</sup>
      </p>

      <p>This isn't the first time structural adaptors for language models have been discussed; Ruffolo et al<sup>[<a href="#fn9" id="fnref9">9</a>]</sup> discussed the idea for generative modeling using the ProGen language model late last year. But this is (to my knowledge) the first time I've seen it for this kind of property prediction. It's also worth noting that this scheme only works when large-scale data is available, as it adds thousands of parameters that would, in a normal experimental setup, be underdetermined without some kind of regularization.</p>

      <section className="footnotes">
        <hr />
        <ol>
          {/* Note: Brackets removed from titles as requested */}
          <li id="fn1">Dauparas et al. <a href="https://doi.org/10.1126/science.add2187">"Robust deep learning-based protein sequence design using ProteinMPNN"</a> Science 2022 <a href="#fnref1" title="Jump back to footnote 1 in the text">↩</a></li>
          <li id="fn2">Lin et al. <a href="https://doi.org/10.1126/science.ade2574">"Evolutionary-scale prediction of atomic-level protein structure with a language model"</a> Science 2023 <a href="#fnref2" title="Jump back to footnote 2 in the text">↩</a></li>
          <li id="fn3">Hsu et al. <a href="https://doi.org/10.1101/2022.04.10.487779">"Learning inverse folding from millions of predicted structures"</a> ICML 2022 <a href="#fnref3" title="Jump back to footnote 3 in the text">↩</a></li>
          <li id="fn4">Su et al. <a href="https://doi.org/10.1101/2023.10.01.560349">"SaProt: Protein language modeling with structure-aware vocabulary"</a> ICLR 2024 <a href="#fnref4" title="Jump back to footnote 4 in the text">↩</a></li>
          <li id="fn5">Notin et al. <a href="https://doi.org/10.1101/2023.12.07.570727">"ProteinGym: Large-scale benchmarks for protein design and fitness prediction"</a> biorxiv 2023 <a href="#fnref5" title="Jump back to footnote 5 in the text">↩</a></li>
          <li id="fn6">Li & Luo. <a href="https://doi.org/10.1101/2025.02.13.638154">"Rewiring protein sequence and structure generative models to enhance protein stability prediction"</a> biorxiv 2025 <a href="#fnref6" title="Jump back to footnote 6 in the text">↩</a></li>
          <li id="fn7">Tsuboyama et al. <a href="https://doi.org/10.1038/s41586-023-06328-6">"Mega-scale experimental analysis of protein folding stability in biology and protein design"</a> Nature 2023 <a href="#fnref7" title="Jump back to footnote 7 in the text">↩</a></li>
          <li id="fn8">Dieckhaus et al. <a href="https://doi.org/10.1073/pnas.2314853121">"Transfer learning to leverage larger datasets for improved prediction of protein stability changes"</a> PNAS 2024 <a href="#fnref8" title="Jump back to footnote 8 in the text">↩</a></li>
          <li id="fn9">Ruffolo et al. <a href="https://doi.org/10.1101/2024.08.03.606485">"Adapting protein language models for structure-conditioned design"</a> biorxiv 2024 <a href="#fnref9" title="Jump back to footnote 9 in the text">↩</a></li>
        </ol>
      </section>
    </>
  ),
};