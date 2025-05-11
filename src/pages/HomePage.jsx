// src/pages/HomePage.jsx
import React, { useState, useMemo } from 'react';
import BlogPostPreview from '../components/BlogPostPreview';
import { posts } from '../blog-posts/posts';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    // 1. Get all defined categories from the posts
    const allDefinedCategories = posts
      .map((post) => post.category)
      .filter(Boolean); // filter(Boolean) removes any null, undefined, or empty strings

    // 2. Get unique categories from this list
    const uniqueCategories = [...new Set(allDefinedCategories)];

    // 3. Sort the unique categories alphabetically
    //    localeCompare is good for robust string sorting (handles various characters, though for simple English categories .sort() often works too)
    uniqueCategories.sort((a, b) => a.localeCompare(b));

    // 4. Prepend 'All' to the now sorted list of unique categories
    return ['All', ...uniqueCategories];
  }, []); // The empty dependency array [] means this runs once when the component mounts,
           // which is fine because 'posts' is imported statically.

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') {
      return posts;
    }
    return posts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]); // Only re-filter when selectedCategory changes

  return (
    <div>
      <h1>Blog Posts</h1>

      <div
        className="category-filters"
        style={{
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #eee',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border:
                selectedCategory === category
                  ? '2px solid steelblue'
                  : '1px solid #ccc',
              backgroundColor:
                selectedCategory === category ? '#e0efff' : 'white',
              fontWeight: selectedCategory === category ? 'bold' : 'normal',
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <BlogPostPreview key={post.id} post={post} />
        ))
      ) : (
        <p>No posts found in the "{selectedCategory}" category!</p>
      )}
      <p style={{marginTop: '3rem', fontSize: '0.8em', color: '#777'}}><em>This site has been entirely built by vibe coding with Gemini Pro.</em></p>
    </div>
  );
}

export default HomePage;