import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { logout, selectIsAuthenticated } from "@/store/authSlice";
import { verifyToken } from "@/store/authSlice";
import { loggedUser } from  "@/store/authSlice";
import { selectAuthStatus } from "@/store/authSlice";
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(loggedUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    // Restore token header if exists
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    // Only verify if token exists
    if (user?.token) {
      dispatch(verifyToken());
    }
  }, [dispatch, user?.token]);

  // Redirect from login if authenticated (after verification)
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => {
        if (response.headers['x-new-token']) {
          dispatch({ type: 'auth/setToken', payload: response.headers['x-new-token'] });
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          dispatch(logout());
          if (location.pathname !== '/login') {
            navigate('/login', { replace: true });
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [dispatch, navigate, location.pathname]);

  // Optional: Show loading if verifying
  if (user?.token && selectAuthStatus === 'loading') {
    return <div>Loading...</div>; // Or a spinner component
  }

  return children;
};

export default AuthProvider;