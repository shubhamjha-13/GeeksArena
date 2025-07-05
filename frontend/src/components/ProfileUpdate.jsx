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
      navigate(`/profile`, { state: { updated: true } });
    } catch (err) {
      console.error("Update failed", err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 px-4 bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Update Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <img
                src={previewImage || "/images/placeholder1.webp"}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
              />
              <label
                htmlFor="imageUpload"
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition"
                title="Change Image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 11l4 4m0 0l-4 4m4-4H5m9 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2z"
                  />
                </svg>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-400">Click icon to upload</p>
          </div>

          {/* Inputs */}
          {[
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Age", name: "age", type: "number" },
            { label: "GitHub", name: "github", type: "url" },
            { label: "Location", name: "location", type: "text" },
          ].map((input) => (
            <div key={input.name}>
              <label className="block font-semibold mb-1">{input.label}</label>
              <input
                type={input.type}
                name={input.name}
                className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData[input.name]}
                onChange={handleChange}
                required={["firstName", "lastName"].includes(input.name)}
              />
            </div>
          ))}

          {/* Bio */}
          <div>
            <label className="block font-semibold mb-1">Bio</label>
            <textarea
              name="bio"
              className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
