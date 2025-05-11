// src/components/MolstarViewer.jsx
import React, { useEffect, useRef } from 'react';

const MolstarViewer = ({ pdbId, customPdbUrl, options: customOptions }) => {
  const viewerRef = useRef(null);
  const instanceRef = useRef(null); // To store the viewer instance

  useEffect(() => {
    if (!window.PDBeMolstarPlugin) {
      console.error('PDBeMolstarPlugin is not loaded. Please include its script in your HTML.');
      return;
    }

    const defaultOptions = {
      customData: customPdbUrl ? {
        url: customPdbUrl,
        format: 'pdb', // Will be refined below
        binary: false,
      } : undefined,
      moleculeId: !customPdbUrl && pdbId ? pdbId : undefined,
      hideStructure: ['water'], // e.g. ['water', 'het']
      alphafoldView: true, // Set to false if not loading AlphaFoldDB structures by default
      bgColor: { r: 255, g: 255, b: 255 },
      hideCanvasControls: [
        'selection',
        'animation', // Keep 'animation' if you want to cycle through models
        'controlToggle',
        'controlInfo',
      ],
      sequencePanel: true,
      landscape: false,
      hideControls: true,
      // *******************************************************************
      // ADD THIS LINE TO SHOW ALL MODELS FOR ENSEMBLES (e.g., NMR)
      defaultPreset: 'all-models', // Options: 'default', 'unitcell', 'all-models', 'supercell'
      // *******************************************************************
    };

    const viewerOptions = { ...defaultOptions, ...customOptions };

    if (customPdbUrl) {
        viewerOptions.customData = {
            url: customPdbUrl,
            format: customPdbUrl.toLowerCase().endsWith('.cif') || customPdbUrl.toLowerCase().endsWith('.bcif') ? 'cif' : 'pdb',
            binary: customPdbUrl.toLowerCase().endsWith('.bcif'),
        };
        delete viewerOptions.moleculeId;
    } else if (pdbId) {
        viewerOptions.moleculeId = pdbId;
        delete viewerOptions.customData;
    } else if (!viewerOptions.customData && !viewerOptions.moleculeId) {
        console.warn("MolstarViewer: No pdbId or customPdbUrl provided. Loading default '1cbs'.");
        viewerOptions.moleculeId = '1cbs'; // Example fallback
    }

    if (viewerRef.current && !instanceRef.current) {
      const viewerInstance = new PDBeMolstarPlugin();
      instanceRef.current = viewerInstance;
      viewerInstance.render(viewerRef.current, viewerOptions);
    }

    return () => {
      if (instanceRef.current && typeof instanceRef.current.dispose === 'function') {
        // instanceRef.current.dispose(); // Consult Molstar docs for proper cleanup
      }
      instanceRef.current = null;
    };
  }, [pdbId, customPdbUrl, customOptions]);

  return (
    <div
      ref={viewerRef}
      style={{
        width: '100%',
        maxWidth: '650px',
        height: '600px',
        position: 'relative',
        margin: '20px auto',
        border: '1px solid #eee'
      }}
    >
      {/* Molstar will render here */}
    </div>
  );
};

export default MolstarViewer;