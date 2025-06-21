import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { storeContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UserProfile = () => {
  const { token, fetchToken } = useContext(storeContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get("/user/profile", {
        headers: { token },
      });

      if (res.data.success) {
        setUser(res.data.user);
      } else {
        toast.error(res.data.message || "Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      toast.error("Failed to load user profile");
    }
  };

  useEffect(() => {
    fetchUserProfile()
  }, [])

  useEffect(() => {
    fetchToken();
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-lg">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-shrink-0">
          <img
            src={user?.profile_image || "https://ui-avatars.com/api/?name=" + user?.name}
            alt="User Avatar"
            className="h-28 w-28 rounded-full border-2 border-gray-300 object-cover"
          />
        </div>

        <div className="flex-1 space-y-4 text-gray-800 w-full">
          <div>
            <h2 className="text-lg font-semibold">Name</h2>
            <p className="text-gray-600">{user.name}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <h2 className="text-lg font-semibold">Phone</h2>
              <p className="text-gray-600">{user.phone}</p>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">Joined</h2>
            <p className="text-gray-600">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() => navigate("/user/profile/edit")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
