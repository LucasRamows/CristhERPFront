import { useNavigate } from "react-router-dom";

export const useRedirectIfPublic = () => {
  const navigate = useNavigate();

  return (userRole: string) => {
    if (userRole === "CLIENT") {
      navigate("/client/portal", { replace: true });
    } else if (userRole === "USER") {
      navigate("/user/call", { replace: true });
    } else {
      navigate("/root/dashboard", { replace: true });
    }
  };
};