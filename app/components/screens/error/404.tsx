import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

export default function Error404() {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-muted-foreground select-none">404</div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, the page you're looking for seems to have wandered off into the digital wilderness.
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() =>navigate(-1)}
            className="w-full "
            variant={'destructive'}
          >
            Go Back
          </Button>
        
        </div>
      </div>
    </div>
  );
}