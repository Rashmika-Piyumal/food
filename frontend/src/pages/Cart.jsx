import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = () => {
    setLoading(true);
    api
      .get("/cart")
      .then((res) => setItems(res.data.data.items || []))
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load cart");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQuantity = async (menuItemId, quantity) => {
    if (quantity < 1) return;
    await api.put(`/cart/${menuItemId}`, { quantity });
    loadCart();
    window.dispatchEvent(new Event("foodexpress:cart-changed"));
  };

  const removeItem = async (menuItemId) => {
    await api.delete(`/cart/${menuItemId}`);
    loadCart();
    window.dispatchEvent(new Event("foodexpress:cart-changed"));
  };

  const total = items.reduce((sum, item) => sum + item.menuItemId.price * item.quantity, 0);

  if (loading) return <p className="p-6 text-center">Loading cart...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">
          Your cart is empty. <Link to="/" className="text-blue-600 hover:underline">Browse restaurants</Link>
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between items-center border rounded-lg p-4">
                <div>
                  <h3 className="font-medium">{item.menuItemId.name}</h3>
                  <p className="text-sm text-gray-500">${item.menuItemId.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.menuItemId._id, item.quantity - 1)}
                    className="w-8 h-8 border rounded-md hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId._id, item.quantity + 1)}
                    className="w-8 h-8 border rounded-md hover:bg-gray-100"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.menuItemId._id)}
                    className="text-red-600 text-sm ml-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="block text-center bg-blue-600 text-white py-3 rounded-md mt-4 hover:bg-blue-700"
          >
            Proceed to Checkout
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;
