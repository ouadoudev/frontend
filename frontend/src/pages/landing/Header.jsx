import { useState, useEffect } from "react";
import { loggedUser, logout } from "@/store/authSlice";
import { fetchUsers } from "@/store/userSlice";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(loggedUser);
  const users = useSelector((state) => state.user.users);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      await dispatch(fetchUsers());
      setLoading(false);
    };
    loadUsers();
  }, [dispatch]);

  // Vérifie s'il y a un admin
  const adminExists = users?.some((u) => u.role === "admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/educational-cycle", label: "Cycle Éducatif" },
    { href: "/procedure", label: "Procédure d'Abonnement" },
    { href: "/contact", label: "Contact" },
  ];

  const handleNavigate = (cycle) => {
    navigate(`/educational-cycle?cycle=${cycle}`);
  };
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    window.location.replace("/");
  };
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? " bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container ">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/tamadrus_logo.png"
                className="h-12 mb-3"
                alt="tamadrus logo"
              />
              <span className="font-semibold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tamadrus
              </span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    {link.href === "/educational-cycle" ? (
                      <>
                        <NavigationMenuTrigger className="bg-transparent">
                          {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid gap-3 text-center p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            {[
                              "Primaire",
                              "Collège",
                              "Lycée",
                              "Universitaire",
                            ].map((cycle) => (
                              <li key={cycle}>
                                <NavigationMenuLink asChild>
                                  <a
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    onClick={() => handleNavigate(cycle)}
                                  >
                                    <div className="text-sm font-medium leading-none capitalize">
                                      {cycle}
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {cycle === "Primaire" &&
                                        "Enseignement de base, pour les enfants."}
                                      {cycle === "Collège" &&
                                        "Enseignement secondaire, pour les adolescents."}
                                      {cycle === "Lycée" &&
                                        "Enseignement secondaire supérieur, préparation à l'université ou à la vie professionnelle."}
                                      {cycle === "Universitaire" &&
                                        "Enseignement supérieur, université et formations professionnelles."}
                                    </p>
                                  </a>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link to={link.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            {!user && !loading ? (
              <>
                {!adminExists ? (
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => navigate("/register/admin")}
                  >
                    Register Admin
                  </Button>
                ) : (
                  <>
                    {" "}
                    <Button variant="ghost" onClick={() => navigate("/login")}>
                      Se connecter
                    </Button>
                    <Button
                      onClick={() => navigate("/register/teacher")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      Devenir Enseignant
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Avatar
                  className="cursor-pointer h-12 w-12 ring-2 ring-transparent hover:ring-primary/20 transition-all"
                  onClick={() => {
                    if (user?.role === "admin") {
                      navigate("/dashboard");
                    } else if (user?.role === "teacher") {
                      navigate("/teacher");
                    } else if (user?.role === "student") {
                      navigate("/profile");
                    }
                  }}
                >
                  <AvatarImage src={user?.user_image?.url} alt="profile" />
                  <AvatarFallback>
                    {user?.username
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  className="text-sm bg-gradient-to-l from-blue-600 to-purple-600"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </Button>
              </>
            )}
          </div>

          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100 " : "max-h-0 opacity-0"
        } overflow-hidden bg-background`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <div key={link.href}>
              {link.href === "/educational-cycle" ? (
                <>
                  <button
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary-foreground/10 transition-colors duration-300"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                  >
                    {link.label}
                  </button>
                  <div className="pl-4">
                    {["Primaire", "Collège", "Lycée", "Universitaire"].map(
                      (cycle) => (
                        <Link
                          key={cycle}
                          to={`/educational-cycle?cycle=${cycle}`}
                          className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary-foreground/10 transition-colors duration-300"
                          onClick={() => {
                            handleNavigate(cycle);
                            setIsMenuOpen(false);
                          }}
                        >
                          {cycle}
                        </Link>
                      )
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary-foreground/10 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}

          <div className="mt-4 space-y-2">
            {!user ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Se connecter
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/register/teacher");
                    setIsMenuOpen(false);
                  }}
                >
                  Devenir Enseignant
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3">
                  <Avatar className="cursor-pointer h-8 w-8 ring-2 ring-transparent hover:ring-primary/20 transition-all">
                    <AvatarImage src={user?.user_image?.url} alt="profile" />
                    <AvatarFallback>
                      {user?.username
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{user?.username}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (user?.role === "admin") {
                      navigate("/dashboard");
                    } else if (user?.role === "teacher") {
                      navigate("/teacher");
                    } else if (user?.role === "student") {
                      navigate("/profile");
                    }
                    setIsMenuOpen(false);
                  }}
                >
                  Mon Espace
                </Button>

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => {
                    dispatch(logout());
                    setIsMenuOpen(false);
                  }}
                >
                  Se déconnecter
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Header;
