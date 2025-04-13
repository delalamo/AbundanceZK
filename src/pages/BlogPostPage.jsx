// src/pages/BlogPostPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { findPostById } from '../blog-posts/posts'; // Import the helper function and data

function BlogPostPage() {
  // Get the 'postId' parameter from the URL (defined in App.jsx route)
  const { postId } = useParams();
  const post = findPostById(postId); // Find the post data using the ID

  if (!post) {
    return (
      <div>
        <h2>Post not found!</h2>
        <p>Sorry, we couldn't find the post you were looking for.</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  // WARNING: Only use dangerouslySetInnerHTML if you trust the source of 'post.content'.
  // If posts were user-generated or from less trusted sources, you'd need to sanitize
  // the HTML to prevent XSS attacks. For Markdown parsing, libraries often handle this.
  return (
    <article>
      <h1>{post.title}</h1>
      <p className="post-meta">Published on: {post.date}</p>
      {/* Render the HTML content string */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <hr style={{ margin: '2rem 0' }}/>
      <Link to="/"> &laquo; Back to all posts</Link>
    </article>
  );
}

export default BlogPostPage;