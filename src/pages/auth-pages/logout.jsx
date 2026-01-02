import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth-services/authService"; 

export function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logoutUser(); // Optional: This could be an API call
        localStorage.removeItem("user"); // Ensure local session is cleared
      } catch (err) {
        console.error("Logout failed:", err);
      }

      navigate("/login", { replace: true }); // Prevent back nav
    };

    doLogout();
  }, [navigate]);

  return <p>Logging out...</p>; // Optional: show spinner/loading
}

export default Logout;
