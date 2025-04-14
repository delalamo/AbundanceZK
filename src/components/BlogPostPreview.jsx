// src/components/BlogPostPreview.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Accepts a 'post' object as a prop
function BlogPostPreview({ post }) {
  if (!post) {
    return null; // Don't render if no post data
  }

  return (
    // Applying bottom margin directly to the article for spacing
    <article
      style={{
        marginBottom: '2rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '1rem',
      }}
    >
      {/* Added className="post-title" to the h2 */}
      <h2 className="post-title">
        <Link to={`/post/${post.id}`}>{post.title}</Link>
      </h2>
      {/* Display category if it exists */}
      {post.category && (
        <p className="post-meta" style={{ fontStyle: 'italic' }}>
          Category: {post.category}
        </p>
      )}
      <p className="post-meta">Published on: {post.date}</p>
      <p className="post-excerpt">{post.excerpt}</p>
      <Link to={`/post/${post.id}`} className="read-more-link">
        Read More &raquo;
      </Link>
    </article>
  );
}

export default BlogPostPreview;
