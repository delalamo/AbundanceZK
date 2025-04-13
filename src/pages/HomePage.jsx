// src/pages/HomePage.jsx
import React from 'react';
import BlogPostPreview from '../components/BlogPostPreview';
import { posts } from '../blog-posts/posts'; // Import the sample post data

function HomePage() {
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.length > 0 ? (
        posts.map(post => (
          <BlogPostPreview key={post.id} post={post} />
        ))
      ) : (
        <p>No posts yet!</p>
      )}
    </div>
  );
}

export default HomePage;