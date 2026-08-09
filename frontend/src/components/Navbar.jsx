import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const refresh = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    if (localStorage.getItem("token")) {
      api
        .get("/cart")
        .then((res) => {
          const items = res.data.data.items || [];
          setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
        })
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refresh();
    window.addEventListener("foodexpress:auth-changed", refresh);
    window.addEventListener("foodexpress:cart-changed", refresh);
    return () => {
      window.removeEventListener("foodexpress:auth-changed", refresh);
      window.removeEventListener("foodexpress:cart-changed", refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("foodexpress:auth-changed"));
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b">
      <Link to="/" className="text-xl font-bold">FoodExpress</Link>

      <div className="flex items-center gap-5 text-sm">
        <Link to="/cart" className="relative">
          Cart
          {cartCount > 0 && (
            <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <span className="text-gray-600">Hi, {user.name}</span>
            <button onClick={handleLogout} className="text-red-600 hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
