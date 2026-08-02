/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { ArrowLeft, Camera, Check, Lock } from "lucide-react";
import "../../App.css";


const UserProfileEdit = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    profilePicture: null,
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const rawContact = response.data.contact || "";
        const cleanContact = (rawContact === "0000000000") ? "" : rawContact;

        setUserData({
          firstname: response.data.firstname || "",
          lastname: response.data.lastname || "",
          email: response.data.email || "",
          contact: cleanContact,
          profilePicture: response.data.profilePicture || null,
          address: response.data.address || {
            street: "",
            city: "",
            state: "",
            country: "",
          },
        });

        if (response.data.profilePicture?.data) {
          const base64Image = `data:${response.data.profilePicture.contentType};base64,${Buffer.from(
            response.data.profilePicture.data
          ).toString("base64")}`;
          setPreviewImage(base64Image);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["street", "city", "state", "country"].includes(name)) {
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should not exceed 10MB.");
        return;
      }

      setUserData({ ...userData, profilePicture: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("firstname", userData.firstname);
      formData.append("lastname", userData.lastname);
      formData.append("email", userData.email);
      formData.append("contact", userData.contact);
      formData.append("address", JSON.stringify(userData.address));

      if (userData.profilePicture) {
        formData.append("profilePicture", userData.profilePicture);
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/profile/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }
        alert("✅ Profile updated successfully!");
        navigate("/users/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Edit Profile Details
            </h1>
            <p className="text-sm text-[#86868b] mt-1">
              Update your account name, contact details, and shipping address.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="apple-card p-8 sm:p-10 bg-white space-y-8 shadow-xl">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <label htmlFor="profilePicture" className="relative cursor-pointer group">
              <img
                src={previewImage || "https://cdn-icons-png.flaticon.com/128/9930/9930370.png"}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full border-2 border-black/10 shadow-md object-cover group-hover:opacity-80 transition"
              />
              <div className="absolute bottom-0 right-0 bg-[#0071e3] text-white p-2 rounded-full shadow-md">
                <Camera size={16} />
              </div>
            </label>
            <span className="text-xs text-[#86868b] mt-2 font-medium">Click image to change photo</span>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-wider border-b border-black/5 pb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#86868b] mb-1">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="apple-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="apple-input"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#86868b]">Email Address</label>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Lock size={10} /> Fixed ID
                  </span>
                </div>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  readOnly
                  disabled
                  className="apple-input bg-gray-100/80 text-gray-500 cursor-not-allowed border-dashed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  value={userData.contact}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className="apple-input"
                />
              </div>
            </div>


            <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-wider border-b border-black/5 pb-2 pt-4">
              Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#86868b] mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={userData.address.street}
                  onChange={handleChange}
                  placeholder="House number, Street name"
                  className="apple-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={userData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="apple-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868b] mb-1">State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={userData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="apple-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#86868b] mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={userData.address.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="apple-input"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="apple-btn-dark flex-1 py-3 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="apple-btn-primary flex-1 py-3 text-sm font-semibold shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Check size={16} />
              <span>{isLoading ? "Saving..." : "Save Account Profile"}</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfileEdit;

