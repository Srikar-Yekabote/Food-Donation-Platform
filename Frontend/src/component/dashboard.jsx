import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar'; // Make sure to create/import your Navbar component

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userFood, setUserFood] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(userRes.data);

        // Fetch user's food donations
        const foodRes = await axios.get('/api/food/my-donations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserFood(foodRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDelete = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`/api/food/${foodId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserFood(userFood.filter(food => food._id !== foodId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete food item');
      }
    }
  };

  const handleMarkCollected = async (foodId) => {
    try {
      await axios.post(`/api/food/${foodId}/collected`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUserFood(userFood.map(food => 
        food._id === foodId ? { ...food, isCollected: true } : food
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as collected');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          {user && (
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Welcome, {user.name}! 👋
            </h1>
          )}

          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
            Your Listed Food Donations 🍱
          </h2>

          {!userFood || userFood.length === 0 ? (
            <p className="text-center text-gray-600">You haven't listed any food yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userFood.map(food => {
                const expiry = new Date(food.expiryDate);
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                const isAvailable = !food.reservedBy && food.status !== 'delivered';
                const isReserved = food.reservedBy && food.status === 'reserved';
                const isPickedUp = food.status === 'picked';
                const isDelivered = food.status === 'delivered';

                if (expiry >= now && !isDelivered) {
                  return (
                    <div key={food._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
                      <p className="text-gray-700">Quantity: {food.quantity}</p>
                      <p className="text-gray-600 text-sm">
                        Expires on: {new Date(food.expiryDate).toDateString()}
                      </p>
                      <p className="text-gray-500 text-sm">
                        <i className="fas fa-map-marker-alt"></i> {food.address}
                      </p>

                      {isAvailable && (
                        <div className="mt-4 flex gap-2">
                          <Link 
                            to={`/edit-food/${food._id}`}
                            className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(food._id)}
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      {isReserved && (
                        <>
                          <p className="text-sm text-yellow-600 mt-2">⏳ Reserved - Waiting for pickup</p>
                          <p className="text-gray-700 mt-1">🔐 OTP: <strong>{food.otp}</strong></p>
                        </>
                      )}

                      {isPickedUp && (
                        <>
                          <p className="text-sm text-blue-600 mt-2">🚚 In Transit</p>
                          {food.otpVerified && !food.isCollected ? (
                            <button
                              onClick={() => handleMarkCollected(food._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mt-2"
                            >
                              ✅ Mark as Collected
                            </button>
                          ) : food.isCollected && (
                            <p className="text-sm text-green-600 mt-2">✅ Collected</p>
                          )}
                        </>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          <div className="text-center mt-6">
            <Link
              to="/list-food"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg m-4 inline-block"
            >
              ➕ List New Food
            </Link>
            <Link
              to="/donor-analytics"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg inline-block"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;