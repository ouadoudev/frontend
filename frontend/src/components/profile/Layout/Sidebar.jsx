import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiClipboard,
} from "react-icons/fi";
import { ChevronFirst, ChevronLast } from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    // Update the active link when the pathname changes
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <div className="h-[98%] mt-2">
      <nav className="h-full flex flex-col bg-white rounded-2xl dark:bg-black border">
        <div className="p-4 flex justify-between items-center">
          <span
            className={`font-semibold text-xl overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            EduTech<span className="text-[#fd46fd]">Bac</span>
          </span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <div className="flex-1 pt-4 px-3">
          <Link
            to="/dashboard"
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
              active === "/dashboard"
                ? "bg-gradient-to-tr from-slate-200 to-slate-100 text-blue-800"
                : ""
            }`}
            onClick={() => setActive("/dashboard")}
          >
            <FiHome />
            <span
              className={`font-medium overflow-hidden transition-all ${
                expanded ? "w-44 ml-3" : "w-0"
              }`}
            >
              My Profile
            </span>
          </Link>
          <Link
            to="/courses"
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
              active === "/courses"
                ? "bg-gradient-to-tr from-slate-200 to-slate-100 text-blue-800"
                : ""
            }`}
            onClick={() => setActive("/courses")}
          >
            <FiBook />
            <span
              className={`font-medium overflow-hidden transition-all ${
                expanded ? "w-44 ml-3" : "w-0"
              }`}
            >
              Courses
            </span>
          </Link>
          <Link
            to="/lessons"
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
              active === "/lessons"
                ? "bg-gradient-to-tr from-slate-200 to-slate-100 text-blue-800"
                : ""
            }`}
            onClick={() => setActive("/lessons")}
          >
            <FiClipboard />
            <span
              className={`font-medium overflow-hidden transition-all ${
                expanded ? "w-44 ml-3" : "w-0"
              }`}
            >
              Assignments
            </span>
          </Link>
          <Link
            to="/messages"
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
              active === "/messages"
                ? "bg-gradient-to-tr from-slate-200 to-slate-100 text-blue-800"
                : ""
            }`}
            onClick={() => setActive("/messages")}
          >
            <FiClipboard />
            <span
              className={`font-medium overflow-hidden transition-all ${
                expanded ? "w-44 ml-3" : "w-0"
              }`}
            >
              Inbox
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
