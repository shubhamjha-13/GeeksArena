import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";

export default function ProfileUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    bio: "",
    github: "",
    location: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get(`/user/getProfileById/${id}`);
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          age: res.data.age || "",
          bio: res.data.bio || "",
          github: res.data.github || "",
          location: res.data.location || "",
          profileImage: res.data.profileImage || "",
        });
        setPreviewImage(res.data.profileImage || null);
      } catch (err) {
        console.error("Error fetching profile", err.message);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "profile_pics");
    data.append("cloud_name", "dxuzousej");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxuzousej/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const json = await res.json();
      setFormData((prev) => ({ ...prev, profileImage: json.secure_url }));
    } catch (err) {
      console.error("Image upload failed", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axiosClient.put(`/user/update/${id}`, formData);
      setLoading(false);
      alert("Profile updated!");
      navigate(`/profile`, { replace: true });
    } catch (err) {
      console.error("Update failed", err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 px-4 bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              className="w-full p-2 rounded bg-gray-700 mt-1"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              className="w-full p-2 rounded bg-gray-700 mt-1"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Age</label>
            <input
              type="number"
              name="age"
              className="w-full p-2 rounded bg-gray-700 mt-1"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Bio</label>
            <textarea
              name="bio"
              className="w-full p-2 rounded bg-gray-700 mt-1"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>GitHub</label>
            <input
              type="url"
              name="github"
              className="w-full p-2 rounded bg-gray-700 mt-1"
              value={formData.github}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Location</label>
            <input
              type="text"
              name="location"
              className="w-full p-2 rounded bg-gray-700 mt-1"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-1"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded-full"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded mt-4"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
