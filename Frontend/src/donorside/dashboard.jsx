import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user, userFood }) => {
  const bgColor = 'bg-[#0d1b2a]';
  const cardColor = 'bg-[#1b263b]';
  const headingColor = 'text-[#e0e1dd]';
  const textColor = 'text-[#778da9]';
  const borderColor = 'border-[#415a77]';

  const renderStatus = (food) => {
    if (food.status === 'available') return 'Available';
    if (food.status === 'reserved') return 'Reserved';
    if (food.status === 'picked') return 'Picked Up';
    if (food.status === 'delivered') return 'Delivered';
    return 'Unknown';
  };

  return (
    <div className={`${bgColor} min-h-screen flex flex-col items-center justify-center`}>
      <div className="container mx-auto p-6 rounded-lg shadow-lg max-w-4xl">
        {user && (
          <h1 className={`text-3xl font-bold text-center mb-6 ${headingColor}`}>
            Welcome, {user.name}! 👋
          </h1>
        )}

        <h2 className={`text-2xl font-semibold mb-4 text-center text-[#e0e1dd]`}>
          Your Listed Food Donations 🍱
        </h2>

        {!userFood || userFood.length === 0 ? (
          <p className={`text-center ${textColor}`}>You haven't listed any food yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userFood.map((food) => {
              const expiry = new Date(food.expiryDate);
              const now = new Date();
              now.setHours(0, 0, 0, 0);

              const isAvailable = !food.reservedBy && food.status !== 'delivered';
              const isReserved = food.reservedBy && food.status === 'reserved';
              const isPickedUp = food.status === 'picked';
              const isDelivered = food.status === 'delivered';

              if (expiry >= now && !isDelivered) {
                return (
                  <div
                    key={food._id}
                    className={`${cardColor} p-4 rounded-lg shadow-md border ${borderColor}`}
                  >
                    <h3 className={`text-lg font-semibold text-[#e0e1dd]`}>{food.name}</h3>
                    <p className={`${textColor}`}>Quantity: {food.quantity}</p>
                    <p className={`text-sm text-[#e0e1dd]`}>
                      Expires on: {new Date(food.expiryDate).toDateString()}
                    </p>
                    <p className="text-sm text-[#e0e1dd]">📍 {food.address}</p>
                    <p className="text-sm text-[#e0e1dd]">Status: {renderStatus(food)}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {isAvailable && (
                        <>
                          <Link
                            to={`/edit-food/${food._id}`}
                            className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500 transition"
                          >
                            Edit
                          </Link>
                          <form method="POST" action={`/delete-food/${food._id}`}>
                            <button
                              type="submit"
                              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          </form>
                        </>
                      )}

                      {isReserved && (
                        <p className="text-sm text-yellow-400 font-semibold">⏳ Reserved</p>
                      )}
                      {isPickedUp && (
                        <p className="text-sm text-blue-400 font-semibold">🚚 Picked Up</p>
                      )}
                      {isDelivered && (
                        <p className="text-sm text-green-400 font-semibold">✅ Delivered</p>
                      )}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
