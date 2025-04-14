import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'; // Keep imports here

// Tooltip component definition
const Tooltip = ({ x, y, data, isVisible, keys, colorScale }) => {
  return (
    <AnimatePresence>
      {isVisible && data && (
        <motion.div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '0.75rem',
            border: '1px solid #555',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            pointerEvents: 'none',
            zIndex: 10,
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '0.8rem',
            width: '210px', // Fixed width
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          <div
            style={{
              marginBottom: '0.5rem',
              borderBottom: '1px solid #666',
              paddingBottom: '0.3rem',
            }}
          >
            <strong>Year: {data.Year}</strong>
          </div>
          {keys.map((key) => {
            const label = key.replace(/_/g, ' ');
            const count = data[key];
            const pctKey = `${key}_pct`;
            const pct = data[pctKey];
            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.2rem',
                }}
              >
                <span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      backgroundColor: colorScale(key),
                      marginRight: '5px',
                      borderRadius: '2px',
                    }}
                  ></span>
                  {label}:
                </span>
                <span>
                  {count} ({!isNaN(pct) ? `${pct}%` : 'N/A'})
                </span>
              </div>
            );
          })}
          <div
            style={{
              marginTop: '0.5rem',
              borderTop: '1px solid #666',
              paddingTop: '0.3rem',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Total:</span>
            <span>{data.Total}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Export the component
export default Tooltip;
