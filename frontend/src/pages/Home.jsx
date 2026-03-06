import { Suspense, lazy } from "react";
import Header from "./landing/Header";
import Hero from "./landing/Hero";
import Faq from "./landing/Faq";
import Contact from "./landing/Contact";
import Footer from "./landing/Footer";
import Features from "./landing/why";

// Lazy imports
const Teachers = lazy(() => import("./landing/Teachers"));
const PopularCourses = lazy(() => import("./landing/PopularCourses"));
const Partenaires = lazy(() => import("./landing/Partenaires"));
const Testimonials = lazy(() => import("./landing/Testimonials"));

// Loading placeholder
const LoadingPlaceholder = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy load on scroll wrapper
import { useInView } from "react-intersection-observer";

const LazyOnScroll = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px", // preload before visible
  });

  return <div ref={ref}>{inView ? children : <LoadingPlaceholder />}</div>;
};

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-0 bg-gradient-to-br from-blue-50 to-purple-50">
        <Hero />

        {/* PopularCourses loads independently */}
        <Suspense fallback={<LoadingPlaceholder />}>
          <PopularCourses />
        </Suspense>

        <Features />

        {/* Teachers only fetched when scrolled into view */}
        <LazyOnScroll>
          <Suspense fallback={<LoadingPlaceholder />}>
            <Teachers />
          </Suspense>
        </LazyOnScroll>

        <Faq />

        <Suspense fallback={<LoadingPlaceholder />}>
          <Testimonials />
        </Suspense>

        <Contact />

        <Suspense fallback={<LoadingPlaceholder />}>
          <Partenaires />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
