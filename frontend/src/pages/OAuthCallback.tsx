import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      toast.error("OAuth login failed. No token found.");
      return navigate("/login");
    }

    // Save token
    localStorage.setItem("token", token);

    // Optional: Redirect to previously intended page
    const redirectPath = localStorage.getItem("postLoginRedirect") || "/";
    toast.success("Logged in via OAuth");
    navigate(redirectPath);
  }, []);

  return <div className="p-4 text-center">Signing you in...</div>;
};

export default OAuthCallback;
