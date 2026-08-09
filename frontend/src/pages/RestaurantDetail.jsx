import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    Promise.all([api.get(`/restaurants/${id}`), api.get(`/menu/${id}`)])
      .then(([restaurantRes, menuRes]) => {
        setRestaurant(restaurantRes.data.data);
        setMenuItems(menuRes.data.data);
      })
      .catch(() => setError("Failed to load restaurant"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async (menuItemId) => {
    setStatusMessage("");
    try {
      await api.post("/cart", { menuItemId, quantity: 1 });
      setStatusMessage("Added to cart");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setStatusMessage("Could not add item to cart");
      }
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!restaurant) return <p className="p-6 text-center">Restaurant not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        &larr; Back to restaurants
      </Link>

      <h1 className="text-3xl font-bold mt-2">{restaurant.name}</h1>
      <p className="text-gray-500">{restaurant.cuisine} · {restaurant.address}</p>
      <p className="text-gray-600 mt-2">{restaurant.description}</p>

      {statusMessage && <p className="mt-4 text-sm text-blue-600">{statusMessage}</p>}

      <h2 className="text-xl font-semibold mt-6 mb-3">Menu</h2>
      {menuItems.length === 0 ? (
        <p className="text-gray-500">No menu items yet.</p>
      ) : (
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center border rounded-lg p-4">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => handleAddToCart(item._id)}
                disabled={!item.isAvailable}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300"
              >
                {item.isAvailable ? "Add to cart" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RestaurantDetail;
