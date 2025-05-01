import React from 'react';

export function FootnoteList({ citationsData = [], idToNumberMap = {}, isLoading, error }) {

  // Filter and sort citations based on whether they were referenced and their assigned number
  const sortedCitations = citationsData
    .filter(citation => idToNumberMap.hasOwnProperty(citation.id))
    .sort((a, b) => idToNumberMap[a.id] - idToNumberMap[b.id]);

  // Determine the ID of the first reference marker for each footnote ID
  // This is complex if not passed down. Simplest is to link back to the number.
  // Or create a map in the first hook: { fn1: 'fnref1', fn2: 'fnref2', fn6: 'fnref6', ... }
  // For now, linking back to '#fnref' + number is a simpler approximation.

  return (
    <section className="footnotes-section">
      <hr />
      <h2>Notes</h2>
      <div className="citation-list">
        {isLoading && <p>Loading citations...</p>}
        {error && <p>Error loading citations: {error.message}</p>}
        {!isLoading && !error && sortedCitations.length === 0 && <p>No citations found.</p>}

        {!isLoading && !error && sortedCitations.map((citation) => (
          <div key={citation.id} id={citation.id} className="citation-item">
            <span className="footnote-list-number">
              {idToNumberMap[citation.id]}. {/* Display number */}
            </span>
            <span
              className="citation-content"
              dangerouslySetInnerHTML={{ __html: citation.formattedHtml }}
            />
            {/* Simple back-link approach */}
            <a
              href={`#fnref${idToNumberMap[citation.id]}`}
              title={`Jump back to footnote ${idToNumberMap[citation.id]} in the text`}
              className="footnote-back-link" // Add class for specific styling
            >
               ↩
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}