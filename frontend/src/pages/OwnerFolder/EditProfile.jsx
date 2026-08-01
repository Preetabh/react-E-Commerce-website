import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import { ArrowLeft, Camera, Check } from "lucide-react";
import "../../App.css";

const UserProfileEdit = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    profilePicture: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/owner/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const owner = response.data.owner;

        setUserData({
          firstname: owner.firstname || "",
          lastname: owner.lastname || "",
          email: owner.email || "",
          contact: owner.contact || "",
          profilePicture: owner.profilePicture || null,
        });

        if (owner.profilePicture?.data) {
          const base64Image = `data:${owner.profilePicture.contentType};base64,${Buffer.from(
            owner.profilePicture.data
          ).toString("base64")}`;
          setPreviewImage(base64Image);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/owner/login");
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstname", userData.firstname);
      formData.append("lastname", userData.lastname);
      formData.append("email", userData.email);
      formData.append("contact", userData.contact);
      if (userData.profilePicture) {
        formData.append("profilePicture", userData.profilePicture);
      }

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/owner/editprofile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/owner/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between font-sans">
      <div>
        <OwnerNavbar />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Edit Administrator Profile
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Update account details and admin profile photo.
              </p>
            </div>
            <button
              onClick={() => navigate("/owner/profile")}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 space-y-6 shadow-sm">
            <div className="flex flex-col items-center">
              <label htmlFor="profilePicture" className="relative cursor-pointer group">
                <img
                  src={previewImage || "https://img.icons8.com/ios7/1200/landlord.jpg"}
                  alt="Profile Preview"
                  className="w-28 h-28 rounded-full border-4 border-slate-100 shadow-md object-cover group-hover:opacity-80 transition"
                />
                <div className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full shadow-md">
                  <Camera size={16} />
                </div>
              </label>
              <span className="text-xs text-slate-500 mt-2 font-semibold">Click photo to update avatar</span>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Admin Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Contact Phone</label>
                <input
                  type="text"
                  name="contact"
                  value={userData.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/owner/profile")}
                className="py-3 px-6 rounded-2xl text-xs font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white flex-1 py-3 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                <Check size={16} />
                <span>{isLoading ? "Saving..." : "Save Admin Profile"}</span>
              </button>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfileEdit;
