import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
        <Header></Header>
        <Hero></Hero>
    </main>
  );
}

// hero content
const Hero = () => (
  <section className="hero">
    {/* content for the hero */}
    <div className="hero_content">
    </div>
  </section>
);

// Header Component
function Header() {

  return(
    <div className="header default-non-image-padding">
      <h2 className="firstHeader">A COLLECTION OF FILMS</h2>
      <h2>IMMERSE YOURSELF</h2>
      <h2>OPEN YOUR MIND</h2>
    </div>
  )
}
