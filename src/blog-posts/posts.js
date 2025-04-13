// src/blog-posts/posts.js

// Sample blog post data.
// In a real app, you might fetch this from an API or parse Markdown files.
export const posts = [
    {
      id: 'getting-started', // Unique identifier, often used in the URL (slug)
      title: 'Getting Started with My Blog',
      date: '2025-04-13',
      excerpt: 'This is the first post on my new blog, setting things up...',
      content: `
        <h2>Welcome!</h2>
        <p>This is the full content of the first blog post. It's written directly in HTML within a JavaScript string for simplicity in this example.</p>
        <p>Normally, you might write this in Markdown and then parse it into HTML using a library.</p>
        <p>You could include <strong>bold text</strong>, <em>italics</em>, lists:</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
        <p>And maybe even code snippets later!</p>
      `
    },
    {
      id: 'react-and-d3',
      title: 'Using React and D3 Together',
      date: '2025-04-14', // Note: Using future date based on context
      excerpt: 'Exploring how React and D3 can be combined for data visualization...',
      content: `
        <h2>React & D3</h2>
        <p>This post will eventually explore how to integrate D3.js visualizations into a React application.</p>
        <p>For now, it's just placeholder text. Imagine a cool chart here!</p>
        <pre><code>// Sample code block
  const viz = d3.select('#chart');
  // ... more D3 code
        </code></pre>
      `
    },
    // Add more post objects here later
  ];
  
  // Helper function to find a post by its ID (slug)
  export const findPostById = (id) => {
    return posts.find(post => post.id === id);
  };