import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "@/store/authSlice";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      dispatch(loginUser({ email, password }));
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Error logging in. Please try again later."
      );
    }
  };

  const handleForgetPassword = () => {
    navigate("/password-reset");
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://najihoun-api.onrender.com/auth/google";};

  const role = useSelector((state) => state.auth.user);

  // Redirect logic based on user role
  if (role) {
    if (role.role === "admin" ) {
      return <Navigate to="/dashboard" />;
    } else if (role.role === "teacher") {
      return <Navigate to="/teacher" />;
    } else if (role.role === "student") {
      return <Navigate to="/profile" />;
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedBackground />
      <div className="min-h-screen z-30 flex items-center justify-center py-1 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl  bg-transparent dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-3 sm:p-4">
              <div className="text-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  Welcome Back!
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Login to your account
                </p>
              </div>
              <Form>
                <form onSubmit={handleSubmit}>
                  <div>
                    <Label
                      htmlFor="email"
                      className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 mb-2 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="user@doamin.com"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="password"
                      className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1 mb-2 block w-full h-8 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                     placeholder="********"
                    />
                  </div>
                  <div className="w-full my-3 flex justify-end">
                    <Button
                      type="button"
                      className=" bg-transparent h-4 text-sm text-indigo-600 hover:text-white"
                      onClick={handleForgetPassword}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-2.5 rounded-md transition duration-150 ease-in-out"
                    type="submit"
                    disabled={isSubmitting}
                  >
                  {isSubmitting ? "Please wait, logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
              <div className="mt-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
              <Button
                className="mt-3 w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1.5 px-2.5 border border-gray-400 rounded-md shadow flex items-center justify-center transition duration-150 ease-in-out"
                type="button"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="mr-2" />
                Sign up with Google
              </Button>
              <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
              Not a Member{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
               Create Account
                </Link>
              </p>
            </div>
            <div className="hidden lg:block w-1/2">
              <img
                className="object-cover w-full h-full"
                src="/login.jfif"
                alt="Office"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
