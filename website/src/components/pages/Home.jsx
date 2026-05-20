import React from 'react';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="features container">
        <h2>How it works</h2>
        <p>We crawl and normalize jobs, then show them here for quick application.</p>
      </section>
    </main>
  );
}
