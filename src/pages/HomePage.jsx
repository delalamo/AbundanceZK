// src/pages/HomePage.jsx
import React, { useState, useMemo } from 'react'; // Import useState and useMemo
import BlogPostPreview from '../components/BlogPostPreview';
import { posts } from '../blog-posts/posts'; // Import the sample post data

function HomePage() {
  // State to hold the currently selected category filter
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default to 'All'

  // Get unique categories from the posts using useMemo to avoid recalculating on every render
  const categories = useMemo(() => {
    const allCategories = posts.map(post => post.category).filter(Boolean); // Get all categories, remove undefined/null
    return ['All', ...new Set(allCategories)]; // Add 'All' and ensure uniqueness
  }, []); // Empty dependency array means this runs only once

  // Filter posts based on the selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') {
      return posts; // Show all posts if 'All' is selected
    }
    return posts.filter(post => post.category === selectedCategory);
  }, [selectedCategory]); // Recalculate only when selectedCategory changes

  return (
    <div>
      <h1>Blog Posts</h1>

      {/* Category Filter Buttons */}
      <div className="category-filters" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #eee', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            // Add styling for the active button
            style={{
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border: selectedCategory === category ? '2px solid steelblue' : '1px solid #ccc',
              backgroundColor: selectedCategory === category ? '#e0efff' : 'white', // Highlight active
              fontWeight: selectedCategory === category ? 'bold' : 'normal',
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Display Filtered Posts */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <BlogPostPreview key={post.id} post={post} />
        ))
      ) : (
        <p>No posts found in the "{selectedCategory}" category!</p> // Message if no posts match filter
      )}
    </div>
  );
}

export default HomePage;
