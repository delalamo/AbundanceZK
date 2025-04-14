// src/blog-posts/content/2025-04-13-getting-started.jsx
// (Assuming this is the post where you embedded the chart)
import React from 'react';
import BicycleFatalitiesPlot from '../../components/plots/2025-04-13/BicycleFatalitiesPlot'; // Adjust path if needed

export const post = {
  id: '2025-04-12-getting-started', // Keep original ID if desired
  title: 'Getting Started and Embedding a Chart',
  date: '2025-04-12',
  // Add the category field
  category: 'Data Viz',
  excerpt: 'This post shows how to embed a React component, like a D3 chart, directly into the content.',
  content: (
    <>
      <h2>Welcome to the Blog!</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <h3>Visualizing Data</h3>
      <p>
        Below is an example using D3.js to visualize the trend of bicyclist fatalities over the years. Click the chart area to load the data. Hover over the points
        to see the details for each year.
      </p>
      <BicycleFatalitiesPlot />
      <h3>More Thoughts</h3>
      <p>
        Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit.
      </p>
    </>
  )
};
