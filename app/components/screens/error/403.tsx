import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

export default function Error403() {
      const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          
          <div className="text-6xl font-bold text-red-200 select-none">403</div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Forbidden</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this resource. Please check your credentials or contact an administrator.
        </p>
        
        <div className="space-y-4">
        
          <Button 
          size={'lg'}
            onClick={() =>navigate(-1)}
            className="w-full bg-white text-red-600 py-3 px-6 rounded-lg font-medium border border-red-200 hover:bg-red-50 transition-colors"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}