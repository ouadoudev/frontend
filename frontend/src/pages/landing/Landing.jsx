import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Landing = () => {
  return (
    <main className=" relative max-h-[100%] overflow-hidden bg-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex flex-col h-full w-full pl-0 ">
          <Header />
          <Outlet />
        </div>
      </div>
      <Footer/>
    </main>
  );
};

export default Landing;
