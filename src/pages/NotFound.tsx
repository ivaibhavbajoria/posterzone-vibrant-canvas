
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! We couldn't find the page you're looking for.</p>
        <p className="text-gray-500 mb-8">
          The page might have been removed, renamed, or doesn't exist.
          {location.pathname === "/auth" && user && (
            <span className="block mt-2 text-green-600">
              You're already signed in. No need to access the auth page.
            </span>
          )}
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            Go Back
          </Button>
          <Link to={user ? (user.isAdmin ? "/admin" : "/") : "/"}>
            <Button className="flex items-center gap-2">
              <Home size={18} />
              {user && user.isAdmin ? "Go to Admin" : "Return to Home"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
