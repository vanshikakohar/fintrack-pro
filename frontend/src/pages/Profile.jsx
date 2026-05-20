import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "sonner";
import { Wallet, TrendingUp, Target, Edit2 } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    occupation: "",
    monthlyIncome: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          occupation: res.data.occupation || "",
          monthlyIncome: res.data.monthlyIncome || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/auth/update`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  if (!user)
    return <div className="flex justify-center mt-10 text-gray-500">Loading profile...</div>;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 h-48 rounded-b-3xl relative">
          <div className="absolute left-10 bottom-[-3rem] flex items-center gap-5">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
<p className="text-gray-100 font-medium">{user.email}</p>
<p className="text-gray-200 text-sm font-medium">
  {user.occupation || "Finance Enthusiast"}
</p>


            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-10 mt-14">
          {/* FINANCIAL SNAPSHOT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <Card
              icon={<Wallet size={22} />}
              title="Monthly Income"
              value={`₹${form.monthlyIncome || "0"}`}
              color="bg-blue-100 text-blue-700"
            />
            <Card
              icon={<TrendingUp size={22} />}
              title="This Month's Spending"
              value="₹23,450"
              color="bg-green-100 text-green-700"
            />
            <Card
              icon={<Target size={22} />}
              title="Budget Goal"
              value="₹50,000"
              color="bg-purple-100 text-purple-700"
            />
          </div>

          {/* EDITABLE DETAILS */}
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Profile Details</h2>
              <button
                onClick={() => (editing ? handleSave() : setEditing(true))}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <Edit2 size={16} />
                {editing ? "Save" : "Edit"}
              </button>
            </div>

            <div className="space-y-5">
              <DetailField
                label="Full Name"
                value={form.name}
                name="name"
                editing={editing}
                onChange={handleChange}
              />
              <DetailField
                label="Occupation"
                value={form.occupation}
                name="occupation"
                editing={editing}
                onChange={handleChange}
              />
              <DetailField
                label="Monthly Income (₹)"
                value={form.monthlyIncome}
                name="monthlyIncome"
                editing={editing}
                onChange={handleChange}
              />
              <DetailField label="Email" value={user.email} disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CARD COMPONENT
function Card({ icon, title, value, color }) {
  return (
    <div className={`rounded-xl shadow-sm bg-white p-5 flex items-center gap-4`}>
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// FIELD COMPONENT
function DetailField({ label, value, name, editing, onChange, disabled }) {
  return (
    <div>
      <label className="block text-gray-500 text-sm mb-1">{label}</label>
      {editing && !disabled ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      ) : (
        <p className="text-gray-800 font-medium">{value || "—"}</p>
      )}
    </div>
  );
}
// import React, { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import axios from "axios";
// import { toast } from "sonner";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     occupation: "",
//     monthlyIncome: "",
//   });
//   const [loading, setLoading] = useState(false);

//   // Load profile data on mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//         setForm({
//           name: res.data.name || "",
//           email: res.data.email || "",
//           occupation: res.data.occupation || "",
//           monthlyIncome: res.data.monthlyIncome || "",
//         });
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load profile");
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         "http://localhost:5000/api/auth/update",
//         { ...form },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Profile updated successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error updating profile");
//     }
//     setLoading(false);
//   };

//   if (!user) return <div className="flex justify-center mt-10 text-gray-500">Loading profile...</div>;

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />

//       <div className="flex-1 p-10">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

//         <div className="bg-white shadow-md rounded-xl p-6 max-w-xl">
//           <form onSubmit={handleSave} className="space-y-4">
//             <div>
//               <label className="block text-gray-600 mb-1">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600 mb-1">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 readOnly
//                 className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600 mb-1">Occupation</label>
//               <input
//                 type="text"
//                 name="occupation"
//                 value={form.occupation}
//                 onChange={handleChange}
//                 className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600 mb-1">Monthly Income (₹)</label>
//               <input
//                 type="number"
//                 name="monthlyIncome"
//                 value={form.monthlyIncome}
//                 onChange={handleChange}
//                 className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
