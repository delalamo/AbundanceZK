// src/components/BlogPostPreview.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Accepts a 'post' object as a prop
function BlogPostPreview({ post }) {
  if (!post) {
    return null; // Don't render if no post data
  }

  return (
    <article style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
      <h2>
        <Link to={`/post/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="post-meta">Published on: {post.date}</p>
      <p className="post-excerpt">{post.excerpt}</p>
      <Link to={`/post/${post.id}`} className="read-more-link">Read More &raquo;</Link>
    </article>
  );
}

export default BlogPostPreview;