import { Link, useNavigate } from "react-router-dom";
import { Menu, User2, ArrowLeftCircle } from "lucide-react";

export default function UserProfileActions() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="group grid grid-cols-2 mb-4 gap-0 lg:hover:gap-2 hover:gap-24 duration-500 relative shadow-sm">
      {/* Initial Menu Icon */}
      <h1 className="absolute z-10 group-hover:hidden duration-200 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
        <Menu className="w-7 h-7 text-gray-800" aria-hidden="true" />
      </h1>

      <button
        onClick={handleGoBack}
        className="group-hover:rounded-lg group-hover:opacity-100 p-3 bg-white/50 hover:bg-gray-500 backdrop-blur-md group-hover:shadow-xl rounded-bl-lg flex justify-center items-center w-full h-full text-gray-500 hover:text-white duration-200"
        aria-label="Go Back"
      >
        <ArrowLeftCircle
          className="opacity-0 group-hover:opacity-100 duration-200"
          aria-hidden="true"
        />
      </button>

      <Link
        to="/profile"
        className="group-hover:rounded-lg group-hover:opacity-100 p-3 bg-white/50 hover:bg-gradient-to-br from-blue-600 to-purple-600 backdrop-blur-md group-hover:shadow-xl rounded-tl-lg flex justify-center items-center w-full h-full text-[#cc39a4] hover:text-white duration-200"
        aria-label="View Profile"
      >
        <User2
          className="opacity-0 group-hover:opacity-100 duration-200"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
