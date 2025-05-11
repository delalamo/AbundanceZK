// src/components/MolstarViewer.js (adjust path as needed)
import React, { useEffect, useRef } from 'react';

const MolstarViewer = ({ pdbId, customPdbUrl, options: customOptions }) => {
  const viewerRef = useRef(null);
  const instanceRef = useRef(null); // To store the viewer instance

  useEffect(() => {
    // Ensure PDBeMolstarPlugin is loaded
    // This script assumes PDBeMolstarPlugin is loaded globally (e.g., in your index.html)
    if (!window.PDBeMolstarPlugin) {
      console.error('PDBeMolstarPlugin is not loaded. Please include its script in your HTML.');
      return;
    }

    // Default options, can be overridden by props
    const defaultOptions = {
      customData: customPdbUrl ? {
        url: customPdbUrl,
        format: 'pdb', // Or determine from URL extension if possible
        binary: false,
      } : undefined,
      moleculeId: !customPdbUrl && pdbId ? pdbId : undefined,
      hideStructure: ['water'],
      alphafoldView: true,
      bgColor: { r: 255, g: 255, b: 255 },
      hideCanvasControls: [
        'selection',
        'animation',
        'controlToggle',
        'controlInfo',
      ],
      sequencePanel: true,
      landscape: false, // Adjust as needed, original snippet had true
      hideControls: true,
      // ... other defaults from your snippet or Molstar docs
    };

    const viewerOptions = { ...defaultOptions, ...customOptions };

    // Use customPdbUrl if provided, otherwise use pdbId
    if (customPdbUrl) {
        viewerOptions.customData = {
            url: customPdbUrl,
            format: customPdbUrl.endsWith('.cif') || customPdbUrl.endsWith('.bcif') ? 'cif' : 'pdb', // Basic format detection
            binary: customPdbUrl.endsWith('.bcif'),
        };
        delete viewerOptions.moleculeId; // Ensure moleculeId is not used if customData is present
    } else if (pdbId) {
        viewerOptions.moleculeId = pdbId;
        delete viewerOptions.customData;
    } else if (!viewerOptions.customData && !viewerOptions.moleculeId) {
        // Fallback to a default example if nothing is provided
        console.warn("MolstarViewer: No pdbId or customPdbUrl provided. Loading default '1cbs'.");
        viewerOptions.moleculeId = '1cbs';
    }


    if (viewerRef.current && !instanceRef.current) { // Check if instance already created
      const viewerInstance = new PDBeMolstarPlugin();
      instanceRef.current = viewerInstance; // Store the instance
      viewerInstance.render(viewerRef.current, viewerOptions);
    }

    // Cleanup function (optional, if Molstar provides a way to destroy the instance)
    return () => {
      if (instanceRef.current && typeof instanceRef.current.dispose === 'function') {
        // instanceRef.current.dispose(); // Or whatever the cleanup method is
      }
      // If the library doesn't offer a dispose, you might need to clear the div manually
      // if (viewerRef.current) {
      //   viewerRef.current.innerHTML = '';
      // }
      instanceRef.current = null;
    };
    // Rerun effect if pdbId, customPdbUrl or customOptions change
  }, [pdbId, customPdbUrl, customOptions]);

  return (
    <div
      ref={viewerRef}
      style={{
        width: '100%', // Make it responsive or use fixed values from your snippet
        maxWidth: '650px',
        height: '600px',
        position: 'relative',
        margin: '20px auto', // Centered
        border: '1px solid #eee' // Optional: add a border
      }}
    >
      {/* Molstar will render here */}
    </div>
  );
};

export default MolstarViewer;