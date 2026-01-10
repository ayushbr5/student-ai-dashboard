import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import ToolsGrid from '../components/landing/ToolsGrid';
import About from '../components/landing/About';
import HowItWorks from '../components/landing/HowItWorks';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-violet-500/30 selection:text-violet-900 dark:selection:text-violet-200">
      <Navbar />
      <Hero />
      <Features />
      <ToolsGrid />
      <HowItWorks />
      <About />
      <CTA />
      <Footer />
    </main>
  );
}