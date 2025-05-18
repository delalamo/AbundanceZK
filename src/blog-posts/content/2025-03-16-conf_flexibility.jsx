import React, { useRef } from 'react'; // Import useRef
// Import MathJax if needed (not used here)
// Import the hooks and component (adjust paths as needed)
import { useInTextFootnoteNumbering } from '../../hooks/useInTextFootnoteNumbering';
// Ensure this hook is the simplified version above
import { useCitationData } from '../../hooks/useCitationData';
import { FootnoteList } from '../../components/FootnoteList';

// Define config specific to this post, using 'doi' key for all identifiers
const footnotesConfig = [
    { id: 'fn1', doi: '10.1016/j.sbi.2023.102645' },  // Sala et al (DOI)
    { id: 'fn2', doi: '10.1101/2024.12.05.626885' },  // Lewis et al (Biorxiv DOI)
    { id: 'fn3', doi: '10.48550/arXiv.2402.04845' },  // Jing et al (arXiv ID via doi key)
    { id: 'fn4', doi: '10.48550/arXiv.2306.03117' },  // Lu et al (arXiv ID via doi key)
    // fn5, fn6 are missing
    { id: 'fn7', doi: '10.1101/2025.03.09.642148' },  // Janson et al (Biorxiv DOI)
    { id: 'fn8', doi: '10.1038/s41586-021-03819-2' },  // Jumper et al (DOI)
    { id: 'fn9', doi: '10.1126/science.1208351' },    // Lindorff-Larson et al (DOI)
    { id: 'fn10', doi: '10.1038/s41597-024-04140-z' }, // Mirarchi et al (DOI)
];


export const post = {
  id: '2025-03-14-conf-sampling',
  title: 'Training data for conformational flexibility prediction',
  date: '2025-03-14',
  category: 'Bio/ML',
  excerpt: 'How much data from molecular dynamics simulations are needed to predict protein flexibility?',
  content: (() => {
    // Component function to use hooks
    const ContentComponent = () => {
      const contentRef = useRef(null);

      // Use the custom hooks
      const idToNumberMap = useInTextFootnoteNumbering(contentRef);
      // Hook will now use the 'doi' field from config
      const { citationsData, isLoading, error } = useCitationData(footnotesConfig, { template: 'apa' });

      return (
        <div className="content-container" ref={contentRef}>
          {/* Main blog post JSX content goes here... */}
          {/* Ensure <sup class="footnote-ref">[<a href="#fnX" id="fnrefX"></a>]</sup> structure is used */}
          <p>How much data from molecular dynamics simulations are needed to predict protein flexibility?</p>

          <p>The loadedness of the term "protein dynamics" complicates many attempts at figuring out what scientists want exactly when using modern AI/ML tools to predict protein structural heterogeneity. For the two to three years when AlphaFold2 and related methods were the state of the art, modeling dynamics mostly meant hacking these methods to yield some conformational heterogeneity<sup className="footnote-ref">[<a href="#fn1" id="fnref1"></a>]</sup>. In the last year and a half or so, however, several high-quality neural networks have been released that tackle this problem more directly, at various levels of comprehensiveness: AlphaFlow<sup className="footnote-ref">[<a href="#fn2" id="fnref2"></a>]</sup>, BioEmu<sup className="footnote-ref">[<a href="#fn3" id="fnref3"></a>]</sup>, and Str2str<sup className="footnote-ref">[<a href="#fn4" id="fnref4"></a>]</sup> being some examples.</p>

          <p>In general it seems that two types of neural networks have emerged to fill this gap. The first learns from simulation data for individual proteins and attempts to, in effect, learn fundamental properties about those systems by interpolating them (example <a href="https://delalamo.xyz/post/2025-02-24-low-dim-md">here</a>). The second try to be more generalist, and learn from huge quantities of structural and MD data.</p>

          <p>Earlier this week a preprint was released that attempts to do the second<sup className="footnote-ref">[<a href="#fn7" id="fnref7"></a>]</sup>. The method, sAMt, uses a variational autoencoder and an input structure as a template to model proteins heterogeneity from sequence alone.</p>

          <img src="/assets/post_images/2025_03_14/2025_03_14_A.png" alt="Overview of the network from Janson et al" width="700" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: 'auto' }} />

          <p>There are many things to like about this preprint - unlike the method I discussed before, it uses more modern neural network architectures such as the AlphaFold structure module<sup className="footnote-ref">[<a href="#fn8" id="fnref8"></a>]</sup> and diffusion models, as well as the frame aligned point error loss function. But one thing stood out in this document that warrants further discussion:</p>

          <blockquote> <p>"...free energy values from aSAMt were not in accurate quantitative agreement with the long MD results indicating that aSAMt learned the extent of conformational sampling covering a broad range of conformations but struggles in correctly reproducing relative probabilities between different states . This result may be expected, since the training data from mdCATH were simulations at most 500 ns long with few transitions between alternate states at a given temperature from which relative probabilities could have been learned..."</p> </blockquote>

          <p>In contrast, the long MD simulations against which the conformers are compared last one or more milliseconds<sup className="footnote-ref">[<a href="#fn9" id="fnref9"></a>]</sup>. That's approximately 2,000 longer than the training examples. Moreover, the modeled proteins were explicitly chosen for their ability to quickly fold and unfold, suggesting a degree of comprehensiveness in the simulations. In contrast, the proteins in mdCATH are simply short simulations of a cross-section of structural diversity<sup className="footnote-ref">[<a href="#fn10" id="fnref10"></a>]</sup>.</p>

          <p>This point has been raised in the past in verbal discussions on AlphaFlow. The motions captured in mdCATH are, in effect, Brownian motion, which is neither difficult nor interesting to predict. The value added by a neural network capable of predicting certain properties of protein dynamics would come from, at a minimum, a capacity to predict the weighted distribution of different conformations. Thus far, BioEmu is the closest to achieving this, although its accurate predictions are limited to conformational breadth and folded versus unfolded states. That said, there's no reason that further progress in this field will unlock this capability to learn from the short MD simulations we have available.</p>


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