// src/pages/BlogPostPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { findPostById } from '../blog-posts/posts'; // Import the helper function

function BlogPostPage() {
  // Get the 'postId' parameter from the URL
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

  // Render the post content directly as JSX
  // This assumes post.content is now a React element/JSX
  return (
    <article>
      <h1>{post.title}</h1>
      <p className="post-meta">Published on: {post.date}</p>
      {/* Render the content directly */}
      <div>{post.content}</div> {/* <-- CHANGE HERE */}
      <hr style={{ margin: '2rem 0' }} />
      <Link to="/"> &laquo; Back to all posts</Link>
    </article>
  );
}

export default BlogPostPage;
