import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center gradient-subtle">
      <div className="text-center space-y-6 p-8">
        <div className="text-9xl font-bold gradient-primary bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-4xl font-bold text-foreground">Page Not Found</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg" className="gap-2">
          <a href="/login">
            <Home className="w-4 h-4" />
            Back to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
