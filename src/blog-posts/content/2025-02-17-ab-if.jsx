// src/blog-posts/content/2025-02-17-ab-if.jsx
import React from 'react';
// Import the MathJax component
import { MathJax } from 'better-react-mathjax';

export const post = {
  id: '2025-02-17-antibody-landscape-if',
  title: "Estimating an antibody's conformational landscape using inverse folding",
  date: '2025-02-17',
  category: 'Bio/ML',
  excerpt: "Calculating the full conformational landscape of an antibody, or any medium-sized protein more generally, is computationally expensive. A new preprint introduces a shortcut that could speed this up and accelerate antibody design.",
  content: (
    // Wrap the entire content block with the MathJax component
    // This allows MathJax to find and process the delimiters automatically
      <> {/* Keep the fragment for grouping */}
        <p>Calculating the full conformational landscape of an antibody, or any medium-sized protein more generally, is computationally expensive. A new preprint introduces a shortcut that could speed this up and accelerate antibody design.</p>

        {/* Reverted LaTeX to original form (single \, $$ delimiters) */}
        
        <p>Molecular dynamics simulations and ML-guided inverse folding (structure-based design) naturally complement each other. The former models the conformational landscape of a protein <span style={{ whiteSpace: 'nowrap' }}>(<MathJax inline>{"\\(p(struct|seq)\\)"}</MathJax>)</span>, but is expensive as hell, while the latter quickly calculates the likelihood of a sequence given a static structure <span style={{ whiteSpace: 'nowrap' }}>(<MathJax inline>{"\\(p(seq|struct)\\)"}</MathJax>)</span>. It's natural to attempt to use the latter as a surrogate function that approximates the former using Bayes's theorem:</p>

        {/*
          Display math - kept original delimiters.
          Removed the surrounding div, MathJax should handle block display.
          If not, wrap this p or the $$ block in <MathJax> or add CSS.
        */}
        <p style={{ textAlign: "center" }}>
          <MathJax>{"\\(p(seq|struct) = \\frac{p(struct|seq)p(seq)}{p(struct)}\\)"}</MathJax>
        </p>

        {/* Reverted LaTeX & Footnotes */}
        <p>Plenty of precedent exists for calculating <MathJax inline>{"\\(p(seq)\\)"}</MathJax> using methods like protein language models <sup><a href="#fn1" id="fnref1">1</a>,<a href="#fn2" id="fnref2">2</a></sup>. This is not, however, true of <MathJax inline>{"\\(p(struct)\\)"}</MathJax>: the field has not arrived at  a way to calculate the reasonableness of a structure independent of its sequence.</p>

        <p>In a recent preprint that combines molecular simulations with inverse folding and active learning, Brotzakis et al sidestep to the need to define <MathJax inline>{"\\(p(struct)\\)"}</MathJax> by reframing the problem as a design problem, where the goal is to maximize the reasonableness of a mutant <span style={{ whiteSpace: 'nowrap' }}>(<MathJax inline>{"\\(p(seq_{mut})\\)"}</MathJax>)</span> relative to that of the starting sequence <span style={{ whiteSpace: 'nowrap' }}>(<MathJax inline>{"\\(p(seq_{wt})\\)"}</MathJax>)</span> <sup><a href="#fn3" id="fnref3">3</a></sup>. They do this by rearranging the equation as follows:</p>
        
        <p style={{ textAlign: "center" }}>
          <MathJax>{"\\(p(struct|seq_{mut}) = p(struct|seq_{wt}) \\frac{p(seq_{mut}|struct)p(seq_{wt})}{p(seq_{wt}|struct)p(seq_{mut})}\\)"}</MathJax>        
        </p>

        {/* Reverted LaTeX & Footnotes */}
        <p>The result eliminates the difficult-to-estimate <MathJax inline>{"\\(p(struct)\\)"}</MathJax> and allows relative changes in an protein's conformational landscape to be quickly approximated using inverse folding models like ProteinMPNN <sup><a href="#fn4" id="fnref4">4</a></sup>, instead of calculated from scratch using MD, which is far more expensive. (The authors further cut costs by eliminating <MathJax inline>{"\\(p(seq)\\)"}</MathJax> from their calculations, stating that the narrow design scope doesn't warrant its inclusion; antibody language models tend to show high uncertainty when calculating likelihoods for those residues anyway <sup><a href="#fn5" id="fnref5">5</a></sup>)</p>

        {/* Footnote */}
        <p>For antibodies in particular, the ability to approximate the accuracy of molecular simulations with cheap machine learning methods could be useful given that ML alone is incapable of accurately modeling the most important substructures of those proteins <sup><a href="#fn6" id="fnref6">6</a></sup>.</p>

        <p>The rest of the preprint is short on details, and its main text is only three pages, but I hope the authors further explore this methods development as it could be quite useful.</p>

        <section className="footnotes">
          <hr />
          <ol>
            {/* Footnotes remain the same (brackets removed from titles) */}
            <li id="fn1">Verkuil et al. <a href="https://doi.org/10.1101/2022.12.21.521521">"Language models generalize beyond natural proteins"</a> biorxiv 2022 <a href="#fnref1" title="Jump back to footnote 1 in the text">↩</a></li>
            <li id="fn2">Nijkamp et al. <a href="https://doi.org/10.1016/j.cels.2023.10.002">"Progen2: Exploring the boundaries of protein language models"</a> Cell Systems 2023 <a href="#fnref2" title="Jump back to footnote 2 in the text">↩</a></li>
            <li id="fn3">Brotzakis et al. <a href="https://doi.org/10.1101/2025.02.13.638027">"Design of Protein Sequences with Precisely Tuned Kinetic Properties"</a> biorxiv 2025 <a href="#fnref3" title="Jump back to footnote 3 in the text">↩</a></li>
            <li id="fn4">Dauparas et al. <a href="https://doi.org/10.1126/science.add2187">"Robust deep learning-based protein sequence design using ProteinMPNN"</a> Science 2022 <a href="#fnref4" title="Jump back to footnote 4 in the text">↩</a></li>
            <li id="fn5">Shuai et al. <a href="https://doi.org/10.1016/j.cels.2023.10.001">"IgLM: Infilling language modeling for antibody sequence design"</a> Cell Systems 2023 <a href="#fnref5" title="Jump back to footnote 5 in the text">↩</a></li>
            <li id="fn6">Fernandez-Quintero et al. <a href="https://doi.org/10.1080/19420862.2023.2175319">"Challenges in antibody structure prediction"</a> mAbs 2022 <a href="#fnref6" title="Jump back to footnote 6 in the text">↩</a></li>
          </ol>
        </section>
      </>
  ),
};

// Note: Assumes <MathJaxContext> is provided higher up in your component tree.