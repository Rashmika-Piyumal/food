import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/restaurants")
      .then((res) => setRestaurants(res.data.data))
      .catch(() => setError("Failed to load restaurants"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-center">Loading restaurants...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      {restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {restaurants.map((r) => (
            <Link
              key={r._id}
              to={`/restaurants/${r._id}`}
              className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold">{r.name}</h2>
              <p className="text-sm text-gray-500">{r.cuisine}</p>
              <p className="text-sm text-gray-600 mt-1">{r.description}</p>
              <div className="flex justify-between items-center mt-3 text-sm">
                <span>⭐ {r.rating}</span>
                <span className={r.isOpen ? "text-green-600" : "text-red-600"}>
                  {r.isOpen ? "Open" : "Closed"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
