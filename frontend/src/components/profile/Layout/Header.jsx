

import { loggedUser } from "@/store/authSlice";
import { logout } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  Settings,
  User,
  Search,
  Menu,
  Bell,
  BookOpen,
  GraduationCap,
  Users,
  Calendar,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Header = () => {
  const dispatch = useDispatch();
  const { error, status } = useSelector((state) => state.user);
  const user = useSelector(loggedUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3); // Mock notification count

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // User-related navigation items (former dropdown items)
  const userNavLinks = [
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      onClick: () => navigate("/profile"),
    },
    {
      href: `/update/profile/${user?.id}`,
      label: "Settings",
      icon: Settings,
      onClick: () => navigate(`/update/profile/${user?.id}`),
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageSquare,
      onClick: () => navigate("/messages"),
    },
  ];

  if (status === "loading") {
    return (
      <header className="z-40 py-4 mx-auto max-w-7xl bg-white shadow-lg dark:bg-gray-800 sticky top-4 rounded-2xl">
        <div className="container mx-auto px-4 flex items-center justify-center h-16">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-300 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (status === "failed") {
    return (
      <header className="z-40 py-4 mx-auto max-w-7xl bg-red-50 border border-red-200 sticky top-4 rounded-2xl">
        <div className="container mx-auto px-4 flex items-center justify-center h-16">
          <div className="text-red-600 text-sm">
            Error loading user data: {error}
          </div>
        </div>
      </header>
    );
  }

  const userImageSrc =
    user.user_image?.url || "/placeholder.svg?height=40&width=40";
  const userInitials = user.username?.slice(0, 2).toUpperCase() || "U";

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    window.location.replace("/");
  };

  const isActiveLink = (href) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <header
      className={cn(
        "z-40 py-3 mx-24 bg-white/95 backdrop-blur-sm shadow-lg dark:bg-gray-800/95 sticky top-4 rounded-2xl transition-all duration-300",
        isScrolled && "shadow-xl"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Desktop Navigation - User Links */}
        <div className="hidden lg:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              {userNavLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link to={link.href} onClick={link.onClick}>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "flex items-center space-x-1 text-sm",
                        isActiveLink(link.href) &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      <span className="hidden lg:block">{link.label}</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* User Avatar and Info */}
          <div className="flex items-center space-x-2 mr-16">
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.username}
                </p>
              </div>
            </div>
            {/* Avatar for desktop with dropdown */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-8 w-8 ring-2 ring-transparent hover:ring-primary/20 transition-all">
                    <AvatarImage src={userImageSrc} alt="profile" />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar for mobile without dropdown */}
            <div className="md:hidden block">
              <Avatar className="h-8 w-8 ring-2 ring-transparent">
                <AvatarImage src={userImageSrc} alt="profile" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden h-9 w-9 "
              >
                <Menu className="h-4 w-4 " />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <div className="mt-4 flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={userImageSrc || "/placeholder.svg"}
                        alt="profile"
                      />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.username}</p>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile User Info */}

              {/* Mobile Navigation Links */}
              <div className="mt-6 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4"></div>
                {userNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActiveLink(link.href) &&
                        "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      if (link.onClick) link.onClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                ))}

                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
