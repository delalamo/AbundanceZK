// src/components/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

// The Layout component takes 'children' props, which will be the page components
function Layout({ children }) {
  return (
    <>
      {' '}
      {/* Using Fragment to avoid adding extra div */}
      <Header />
      <main>
        {children} {/* Render the page content here */}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
