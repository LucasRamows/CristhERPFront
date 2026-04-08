import { Loader2 } from "lucide-react";

interface LoadingComponentProps {
  fullScreen?: boolean;
}

const LoadingComponent = ({ fullScreen }: LoadingComponentProps) => {
  return (
    <div
      className={`flex-1 flex items-center justify-center w-full ${
        fullScreen ? "h-screen" : "h-full"
      }`}
    >
      <Loader2 className="w-8 h-8 animate-spin text-green-500" />
    </div>
  );
};

export default LoadingComponent;
