import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const Header = ({ onHamburgerClick }) => {
  const navigate = useNavigate();
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const role = user?.role;

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-white h-15 text-black flex items-center justify-between px-5 md:px-10 ">
      <div className="flex items-center">
        <button onClick={onHamburgerClick} className="mr-3">
          <Menu size={24} />
        </button>
        <h1 className="font-bold tracking-[2px] text-lg">
          JOBZY {role === "admin" ? role.toUpperCase() : ""}
        </h1>
      </div>

      {user && (
        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-1 rounded hover:opacity-90 transition"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
