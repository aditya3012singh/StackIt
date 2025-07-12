import { useNavigate } from "react-router-dom";

export default Logout = () => {
  const navigate = useNavigate();

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};
