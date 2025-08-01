import Header from "./landing/Header";
import Hero from "./landing/Hero";
import Teachers from "./landing/Teachers";
import PopularCourses from "./landing/PopularCourses";
import Faq from "./landing/Faq";
import Contact from "./landing/Contact";
import Footer from "./landing/Footer";
import Features from "./landing/why";
import Partenaires from "./landing/Partenaires";
import Testimonials from "./landing/Testimonials";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-0 bg-gradient-to-br from-blue-50 to-purple-50">
      <Hero />
      <PopularCourses />
      <Features/>
      <Teachers />
       <Faq /> 
      <Testimonials/>
      <Contact />
      <Partenaires/>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
