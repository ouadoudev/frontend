import { Suspense, lazy } from "react";
import Header from "./landing/Header";
import Hero from "./landing/Hero";
const Teachers = lazy(() => import("./landing/Teachers"));
const PopularCourses = lazy(() => import("./landing/PopularCourses"));
import Faq from "./landing/Faq";
import Contact from "./landing/Contact";
import Footer from "./landing/Footer";
import Features from "./landing/why";
const Partenaires = lazy(() => import("./landing/Partenaires"));
const Testimonials = lazy(() => import("./landing/Testimonials"));


// Loading component
const LoadingPlaceholder = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-0 bg-gradient-to-br from-blue-50 to-purple-50">
      <Hero />
       <Suspense fallback={<LoadingPlaceholder />}>
      
      <PopularCourses />
          </Suspense>
      <Features/>
         <Suspense fallback={<LoadingPlaceholder />}>
      <Teachers />
            </Suspense>
       <Faq /> 
      <Testimonials/>
      <Contact />
         <Suspense fallback={<LoadingPlaceholder />}>
      <Partenaires/>
       </Suspense>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
