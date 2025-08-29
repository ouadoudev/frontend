// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   ChevronFirst,
//   ChevronLast,
//   GraduationCap,
//   Home,
//   UserPlus,
//   Users,
//   BookMarked,
//   BookOpen,
//   PlayCircle,
//   CreditCard,
//   Star,
//   MessageSquare,
//   CheckSquare,
//   Calendar,
//   User,
//   Settings,
//   Mail,
//   PlusCircle,
//   LogOut,
//   Handshake,
//   Landmark,
// } from "lucide-react";
// import { FiX } from "react-icons/fi";
// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { loggedUser, logout } from "@/store/authSlice";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const navigationItems = [
//   {
//     title: "Vue d'ensemble",
//     items: [
//       { title: "Tableau de bord", url: "/dashboard", icon: Home, roles: ["admin"] },
//       { title: "Tableau de bord", url: "/teacher", icon: Home, roles: ["teacher"] },
//     ],
//   },
//   {
//     title: "Gestion des utilisateurs",
//     items: [
//       {
//         title: "Enseignants",
//         url: "/teachers",
//         icon: GraduationCap,
//         roles: ["admin"],
//       },
//       {
//         title: "Recrutements",
//         url: "/hiring",
//         icon: UserPlus,
//         roles: ["admin"],
//       },
//       { title: "Étudiants", url: "/students", icon: Users, roles: ["admin"] },
//     ],
//   },
//   {
//     title: "Gestion du contenu",
//     items: [
//       {
//         title: "Matières",
//         url: "/subjects",
//         icon: BookMarked,
//         roles: ["admin"],
//       },
//       {
//         title: "Cours",
//         url: "/courses",
//         icon: BookOpen,
//         roles: ["admin", "teacher"],
//       },
//       {
//         title: "Leçons",
//         url: "/lessons",
//         icon: PlayCircle,
//         roles: ["admin", "teacher"],
//       },
//     ],
//   },
//   {
//     title: "Revenus",
//     items: [
//       {
//         title: "Revenus (Admin)",
//         url: "/revenue-admin",
//         icon: CreditCard,
//         roles: ["admin"],
//       },
//       {
//         title: "Revenus (Enseignant)",
//         url: "/revenue-teacher",
//         icon: CreditCard,
//         roles: ["teacher"],
//       },
//     ],
//   },
//   {
//     title: "Opérations",
//     items: [
//       {
//         title: "Abonnements",
//         url: "/subscription-requests",
//         icon: CreditCard,
//         roles: ["admin"],
//       },
//       {
//         title: "Compte bancaire",
//         url: "/bank",
//         icon: Landmark,
//         roles: ["admin"],
//       },
//       {
//         title: "Témoignages",
//         url: "/testimonial",
//         icon: Star,
//         roles: ["admin"],
//       },
//       {
//         title: "Partenaires",
//         url: "/partenaires",
//         icon: Handshake,
//         roles: ["admin"],
//       },
//       {
//         title: "Conversations",
//         url: "/dashboard/messages",
//         icon: MessageSquare,
//         roles: ["admin", "teacher"],
//       },
//       {
//         title: "Tâches",
//         url: "/tasks",
//         icon: CheckSquare,
//         roles: ["admin", "teacher"],
//       },
//     ],
//   },
// ];


// const Sidebar = ({ open, setOpen }) => {
//   const [expanded, setExpanded] = useState(true);
//   const location = useLocation();
//   const [active, setActive] = useState(location.pathname);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const role = useSelector((state) => state.auth.user) || {};
//   const { status, error } = useSelector((state) => state.auth);
//   const user = useSelector(loggedUser) || {};
//   const userImageSrc = user.user_image?.url || "/profile.png";

//   useEffect(() => {
//     setActive(location.pathname);
//   }, [location.pathname]);

//   if (status === "loading") {
//     return (
//       <aside className="fixed inset-y-0 left-0 w-64 bg-white p-4">
//         <p>Chargement des données utilisateur...</p>
//       </aside>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <aside className="fixed inset-y-0 left-0 w-64 bg-white p-4">
//         <p className="text-red-600">Erreur : {error}</p>
//       </aside>
//     );
//   }

//   const handleProfileUpdate = () => {
//     navigate(`/update/${user.id}`);
//     setOpen(false);
//   };
//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.removeItem("user");
//     window.location.replace("/");
//   };

//   const NavItem = ({ to, icon: Icon, children }) => (
//     <Link
//       to={to}
//       className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
//         active === to
//           ? "bg-gradient-to-tr from-slate-200 to-slate-100 text-blue-800"
//           : "hover:bg-gray-100"
//       }`}
//       onClick={() => setOpen(false)}
//     >
//       <Icon className="w-6 h-6 lg:w-8 lg:h-8" />
//       <span
//         className={`ml-3 font-medium overflow-hidden transition-all ${
//           expanded ? "lg:w-40" : "lg:w-0"
//         } block lg:${expanded ? "block" : "hidden"}`}
//       >
//         {children}
//       </span>
//     </Link>
//   );

//   return (
//     <>
//       <div
//         className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
//           open ? "block" : "hidden"
//         }`}
//         onClick={() => setOpen(false)}
//       ></div>

//       <aside
//         className={`fixed inset-y-0 left-0 rounded-2xl my-4 lg:m-4 z-50 w-64 overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0 ${
//           open ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
//         } ${expanded ? "lg:w-72" : "lg:w-24"}`}
//       >
//         {/* Header */}
//         <div className="sticky top-0 z-10 flex items-center justify-between flex-shrink-0 p-4 bg-white">
//           <span
//             className={`font-semibold text-xl overflow-hidden transition-all text-blue-600 ${
//               expanded ? "w-36" : "w-0"
//             }`}
//           >
//             Prime<span className="text-purple-600">Academy</span>
//           </span>
//           <button
//             onClick={() => setExpanded((curr) => !curr)}
//             className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 lg:block hidden"
//             aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
//           >
//             {expanded ? <ChevronFirst /> : <ChevronLast />}
//           </button>
//           <button
//             onClick={() => setOpen(false)}
//             className="p-1 rounded-md lg:hidden focus:outline-none"
//             aria-label="Close sidebar"
//           >
//             <FiX className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4 h-screen">
//           {navigationItems.map((section) => {
//             const visibleItems = section.items.filter((item) =>
//               item.roles.includes(role.role)
//             );
//             if (visibleItems.length === 0) return null;

//             return (
//               <div key={section.title} className="mb-4">
//                 {expanded && (
//                   <p className="text-gray-500 text-xs font-semibold uppercase mb-2 px-1">
//                     {section.title}
//                   </p>
//                 )}
//                 {visibleItems.map(({ title, url, icon: Icon }) => (
//                   <NavItem key={title} to={url} icon={Icon}>
//                     {title}
//                   </NavItem>
//                 ))}
//               </div>
//             );
//           })}
//         </nav>
//           <div className="my-8">
//             <button
//               onClick={handleProfileUpdate}
//               className={`relative flex items-center w-2/3 px-2 ml-4 py-2  font-medium rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${
//                 active === `/update/${user.id}`
//                   ? "bg-gradient-to-tr from-slate-200 to-slate-100 text-blue-800"
//                   : ""
//               }`}
//             >
//               <Settings className="w-6 h-6 lg:w-8 lg:h-8 " />
//               {expanded && (
//                 <span className="ml-3 font-medium overflow-hidden transition-all">
//                   Paramètres
//                 </span>
//               )}
//             </button>
//           </div>
//         {/* Footer profile */}
//         <div className="sticky bottom-0 z-10 flex flex-col items-center justify-between flex-shrink-0 p-2 bg-white border-t border-gray-200">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Avatar
//                 className={`cursor-pointer ${
//                   expanded ? "w-14 h-14 mb-2" : "w-10 h-10 my-6"
//                 }`}
//               >
//                 <AvatarImage src={userImageSrc} alt="profile" />
//               </Avatar>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-48">
//               <DropdownMenuItem onClick={handleProfileUpdate}>
//                 <Settings className="mr-2 h-4 w-4" />
//                 <span>Settings</span>
//                 <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={handleLogout}>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 <span>Log out</span>
//                 <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <span
//             className={`${
//               expanded
//                 ? "mr-2 text-sm font-medium text-gray-700 hidden md:block"
//                 : "hidden"
//             }`}
//           >
//             {user.username}
//           </span>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronFirst,
  ChevronLast,
  GraduationCap,
  Home,
  UserPlus,
  Users,
  BookMarked,
  BookOpen,
  PlayCircle,
  CreditCard,
  Star,
  MessageSquare,
  CheckSquare,
  Calendar,
  User,
  Settings,
  Mail,

  LogOut,
  Handshake,
  Landmark,
  ChevronsRight,
  ChevronsLeft,
  SquareGanttChart,
  Medal,
} from "lucide-react";
import { FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loggedUser, logout } from "@/store/authSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  {
    title: "Vue d'ensemble",
    items: [
      { title: "Tableau de bord", url: "/dashboard", icon: Home, roles: ["admin"] },
      { title: "Tableau de bord", url: "/teacher", icon: Home, roles: ["teacher"] },
    ],
  },
  {
    title: "Gestion des utilisateurs",
    items: [
      { title: "Enseignants", url: "/teachers", icon: GraduationCap, roles: ["admin"] },
      { title: "Recrutements", url: "/hiring", icon: UserPlus, roles: ["admin"] },
      { title: "Étudiants", url: "/students", icon: Users, roles: ["admin"] },
    ],
  },
  {
    title: "Gestion du contenu",
    items: [
      { title: "Matières", url: "/subjects", icon: BookMarked, roles: ["admin"] },
      { title: "Cours", url: "/courses", icon: BookOpen, roles: ["admin", "teacher"] },
      { title: "Leçons", url: "/lessons", icon: PlayCircle, roles: ["admin", "teacher"] },
      { title: "Ressources", url: "/resources", icon: SquareGanttChart , roles: ["admin", "teacher"] },
    ],
  },
  {
    title: "Revenus",
    items: [
      { title: "Revenus", url: "/revenue-admin", icon: CreditCard, roles: ["admin"] },
      { title: "Revenus", url: "/revenue-teacher", icon: CreditCard, roles: ["teacher"] },
    ],
  },
  {
    title: "Opérations",
    items: [
      { title: "Abonnements", url: "/subscription-requests", icon: CreditCard, roles: ["admin"] },
      { title: "Compte bancaire", url: "/bank", icon: Landmark, roles: ["admin"] },
      { title: "Témoignages", url: "/testimonial", icon: Star, roles: ["admin"] },
      { title: "Partenaires", url: "/partenaires", icon: Handshake, roles: ["admin"] },
      { title: "Conversations", url: "/dashboard/messages", icon: MessageSquare, roles: [ "teacher"] },
      { title: "Conversations", url: "/dashboard/admin/messages", icon: MessageSquare, roles: ["admin"] },
      { title: "Tâches", url: "/tasks", icon: CheckSquare, roles: ["admin", "teacher"] },
      { title: "Badges", url: "/badges", icon: Medal, roles: ["admin"] },
    ],
  },
];

const Sidebar = ({ open, setOpen }) => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = useSelector((state) => state.auth.user) || {};
  const { status, error } = useSelector((state) => state.auth);
  const user = useSelector(loggedUser) || {};
  const userImageSrc = user.user_image?.url || "/profile.png";

  useEffect(() => {
    // Active nav link
    document.querySelectorAll("a").forEach((a) => {
      if (a.pathname === location.pathname) {
        a.classList.add("bg-gradient-to-tr", "from-slate-200", "to-slate-100", "text-blue-800");
      }
    });
  }, [location.pathname]);

  if (status === "loading") {
    return (
      <aside className="fixed inset-y-0 left-0 w-64 bg-white p-4">
        <p>Chargement des données utilisateur...</p>
      </aside>
    );
  }

  if (status === "failed") {
    return (
      <aside className="fixed inset-y-0 left-0 w-64 bg-white p-4">
        <p className="text-red-600">Erreur : {error}</p>
      </aside>
    );
  }

  const handleProfileUpdate = () => {
    navigate(`/update/${user.id}`);
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    window.location.replace("/");
  };

  const NavItem = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
        location.pathname === to
          ? "bg-gradient-to-tr from-slate-200 to-slate-100 text-blue-800"
          : "hover:bg-gray-100"
      }`}
      onClick={() => setOpen(false)}
    >
      <Icon className="w-6 h-6 lg:w-8 lg:h-8" />
      <span
        className={`ml-3 font-medium overflow-hidden transition-all ${
          expanded ? "lg:w-40" : "lg:w-0"
        } block lg:${expanded ? "block" : "hidden"}`}
      >
        {children}
      </span>
    </Link>
  );

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 rounded-2xl my-4 lg:m-4 z-50 transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0
          ${open ? "translate-x-0 ease-out" : "-translate-x-full ease-in"}
          ${expanded ? "lg:w-72" : "lg:w-24"}
          overflow-hidden
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between flex-shrink-0 p-4 bg-white">
             <img src="/tamadrus_logo.png" className="h-10 mb-3" alt="tamadrus logo" />
            <span
              className={`font-semibold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
                expanded ? "w-36 ml-2" : "w-0"
              }`}
            >
             Tamadrus
            </span>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg lg:block hidden"
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {expanded ? <ChevronsLeft /> : <ChevronsRight />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md lg:hidden focus:outline-none"
              aria-label="Close sidebar"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Navigation Area */}
          <div className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
            <nav className="pb-8">
              {navigationItems.map((section) => {
                const visibleItems = section.items.filter((item) =>
                  item.roles.includes(role.role)
                );
                if (visibleItems.length === 0) return null;

                return (
                  <div key={section.title} className="mb-4">
                    {expanded && (
                      <p className="text-gray-500 text-xs font-semibold uppercase mb-2 px-1">
                        {section.title}
                      </p>
                    )}
                    {visibleItems.map(({ title, url, icon: Icon }) => (
                      <NavItem key={title} to={url} icon={Icon}>
                        {title}
                      </NavItem>
                    ))}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer: User Profile */}
          <div className="sticky bottom-0 z-10 flex flex-col items-center justify-between flex-shrink-0 p-2 bg-white border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  className={`cursor-pointer ${
                    expanded ? "w-14 h-14 mb-2" : "w-10 h-10 my-6"
                  }`}
                >
                  <AvatarImage src={userImageSrc} alt="profile" />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={handleProfileUpdate}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span
              className={`${
                expanded
                  ? "mr-2 text-sm font-medium text-gray-700 hidden md:block"
                  : "hidden"
              }`}
            >
              {user.username}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
