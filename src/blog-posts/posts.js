// src/blog-posts/posts.js

// Find all .jsx files in the content directory now
const postModules = import.meta.glob('./content/*.jsx', { eager: true }); // <--- Change '*.js' to '*.jsx'

// Process the imported modules into an array of post objects
export const posts = Object.values(postModules)
  .map((module) => module.post)
  .filter((post) => post !== undefined)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Helper function to find a post by its ID
export const findPostById = (id) => {
  return posts.find((post) => post.id === id);
};
