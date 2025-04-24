// AvailableFood.jsx
import React, { useState } from 'react';

const AvailableFood = ({ foodItems, user }) => {
  const [mapInitialized, setMapInitialized] = useState({});

  const sortedFoodItems = [...foodItems].sort((a, b) => {
    const isPriorityA = a.priority || (new Date(a.expiryDate).toLocaleDateString() === new Date().toLocaleDateString());
    const isPriorityB = b.priority || (new Date(b.expiryDate).toLocaleDateString() === new Date().toLocaleDateString());
    return isPriorityB - isPriorityA;
  });

  const toggleMap = (index) => {
    setMapInitialized((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="bg-gradient-to-r from-navy to-slateBlue min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto p-6 bg-offWhite rounded-lg shadow-lg max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-darkBlue mb-6">Available Food Donations</h1>
        {sortedFoodItems.length === 0 ? (
          <p className="text-center text-steelBlue">No food items available at the moment.</p>
        ) : (
          sortedFoodItems.map((food, index) => (
            <div key={food._id} className="mb-6 border border-steelBlue rounded-lg p-4 bg-white shadow-sm">
              <p><strong>Name:</strong> {food.name}</p>
              <p><strong>Quantity:</strong> {food.quantity}</p>
              <p><strong>Expiry Date:</strong> {new Date(food.expiryDate).toLocaleDateString()}</p>
              <p><strong>Address:</strong> {food.address}</p>
              <p><strong>Status:</strong> <span className={`font-semibold ${
                food.status === 'available' ? 'text-green-600' :
                food.status === 'reserved' ? 'text-orange-500' :
                'text-gray-400'
              }`}>{food.status.charAt(0).toUpperCase() + food.status.slice(1)}</span></p>

              {food.priority && user?.role === 'volunteer' && (
                <div className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  🚨 Priority Pickup
                </div>
              )}

              <div className="mt-3 space-x-2">
                {(food.status === "available" || food.status === "reserved") && user?.role === 'volunteer' && (
                  <>
                    {food.reservedBy && String(food.reservedBy) === String(user.id) ? (
                      <form action={`/cancel-pickup/${food._id}`} method="POST" className="inline-block">
                        <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                          Cancel Pickup
                        </button>
                      </form>
                    ) : (!food.reservedBy || food.status === "available") && (
                      <form action={`/food/${food._id}/reserve`} method="POST" className="inline-block">
                        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700" type="submit">
                          Pickup
                        </button>
                      </form>
                    )}
                  </>
                )}

                {food.status === "reserved" && user?.role === 'donor' && String(user._id) === String(food.user) && (
                  <form action={`/food/${food._id}/deliver`} method="POST" className="inline-block">
                    <button className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-700" type="submit">
                      Mark as Collected
                    </button>
                  </form>
                )}

                {user?.role === 'volunteer' && (
                  <button
                    onClick={() => toggleMap(index)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
                    {mapInitialized[index] ? "❌ Hide Location" : "📍 Show Location"}
                  </button>
                )}
              </div>

              {/* Map and distance display can be implemented here using a map library like Google Maps or Leaflet */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableFood;
