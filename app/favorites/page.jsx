"use client";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";

export default function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  return (
    <div>
    <Navbar/>
      {/* Favorites Header */}
      <div className="w-[95%] mx-auto my-4 md:my-8 bg-white overflow-hidden mb-6">
        <div className="px-4 lg:px-6 py-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            My Favorites ({favorites.length})
          </h2>
        </div>

        {/* Favorites Content */}
        {favorites.length === 0 ? (
          <div className="p-8 text-center border border-gray-200 rounded-lg">
            <div className="text-gray-500 mb-4">No favorites yet</div>
            <div className="text-xs text-gray-400 mb-4">
              Start adding products to your favorites to see them here
            </div>
            <button
              onClick={() => (window.location.href = "/category")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favorites.map((favorite, index) => (
                <div
                  key={favorite.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 relative group hover:shadow-md transition-shadow h-80 flex flex-col"
                >
                  {/* Remove from favorites button */}
                  <button
                    onClick={() => removeFromFavorites(favorite.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Product Image */}
                  <div className="w-full h-32 mb-3 flex items-center justify-center bg-gray-50 rounded-lg flex-shrink-0">
                    <img
                      src={favorite.image}
                      alt={favorite.name}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.target.src = "/laptop.png";
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {favorite.name}
                    </h3>
                    {favorite.category && (
                      <p className="text-xs text-gray-500">
                        {favorite.category}
                      </p>
                    )}
                    <p className="text-lg font-bold text-gray-900">
                      {favorite.price}
                    </p>
                    <p className="text-xs text-gray-400">
                      Added {new Date(favorite.addedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto space-y-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        (window.location.href = `/product/${favorite.id}`)
                      }
                      className="w-full bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                    >
                      View Product
                    </button>
                    <button
                      onClick={() => {
                        addToCart(favorite);
                      }}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
