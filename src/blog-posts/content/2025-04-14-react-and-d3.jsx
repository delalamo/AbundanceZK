// src/blog-posts/content/2025-04-13-getting-started.js
import React from 'react'; // Import React because we are using JSX
import BicycleFatalitiesPlot from '../../components/plots/2025-04-13/BicycleFatalitiesPlot'; // Adjust path if needed

// Export the post object
export const post = {
  // Use a unique ID. Using the filename (without .js) is a common convention.
  id: '2025-04-14-testing-d3',
  title: 'Getting Started and Embedding a Chart',
  date: '2025-04-14',
  excerpt:
    'This post shows how to embed a React component, like a D3 chart, directly into the content.',
  // Content is now JSX, not an HTML string
  content: (
    <>
      {' '}
      {/* Use a Fragment to wrap multiple elements */}
      <h2>Welcome to the Blog!</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <h3>Visualizing Data</h3>
      <p>
        One of the powerful features of using React for blogging is the ability
        to seamlessly embed interactive components. Below is an example using
        D3.js to visualize the trend of bicyclist fatalities over the years.
        Hover over the points to see the details for each year.
      </p>
      {/* Embed the chart component directly */}
      <BicycleFatalitiesPlot />
      <h3>More Thoughts</h3>
      <p>
        Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam
        varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus
        magna felis sollicitudin mauris. Integer in mauris eu nibh euismod
        gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis
        risus a elit. Etiam tempor.
      </p>
    </>
  ),
};
