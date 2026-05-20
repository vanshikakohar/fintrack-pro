import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  PlusCircle,
  Wallet,
  Banknote,
  CreditCard,
  RefreshCcw,
  BarChart3,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", balance: "" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchAccounts = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) return;
    try {
      const res = await axios.get(
        `${API}/accounts?userId=${user._id}`
      );
      setAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  const addAccount = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      toast.error("Please log in first!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/accounts/add`, {
        ...form,
        userId: user._id,
      });
      setForm({ name: "", type: "", balance: "" });
      setShowForm(false);
      fetchAccounts();
      toast.success("Account added successfully!");
    } catch (err) {
      console.error("Error adding account:", err);
      toast.error("Failed to add account");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE ACCOUNT (ONLY NEW LOGIC)
  const deleteAccount = async (id) => {
    try {
      await axios.delete(`${API}/accounts/${id}`);
      toast.success("Account deleted");
      fetchAccounts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const totalBalance = accounts.reduce(
    (acc, cur) => acc + (cur.balance || 0),
    0
  );

  const uploadedTexturePath =
    "/mnt/data/A_digital_screenshot_of_a_web_application_named_%22F.png";

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* ---------- Dashboard Background ---------- */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 10% 10%, rgba(67,56,202,0.12), transparent 12%)," +
              "radial-gradient(900px 500px at 85% 20%, rgba(220, 95, 255, 0.06), transparent 18%)," +
              "linear-gradient(180deg, #03040a 0%, #08030f 60%, #060218 100%)",
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(circle at 25% 25%, rgba(124,58,237,0.22), rgba(124,58,237,0.08) 30%, rgba(0,0,0,0) 55%)," +
              "radial-gradient(circle at 70% 60%, rgba(96,165,250,0.12), rgba(99,102,241,0.05) 30%, rgba(0,0,0,0) 55%)",
          }}
        />
        <div
          className="absolute bottom-[-300px] left-[-300px] w-[700px] h-[700px] rounded-full blur-2xl opacity-40"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(255,99,132,0.07), rgba(255,200,255,0.03) 20%, rgba(0,0,0,0) 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${uploadedTexturePath}")`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.04,
            mixBlendMode: "overlay",
          }}
        />
      </div>

      <Sidebar />

      <div className="flex-1 relative">
        <Topbar />

        <main className="relative z-10 p-8 space-y-8 min-h-[calc(100vh-80px)]">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1
                className="text-3xl font-extrabold"
                style={{
                  background:
                    "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                My Accounts
              </h1>
              <p className="text-gray-300 mt-1">
                Manage all your accounts here
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={fetchAccounts}
                className="bg-white/5 border border-gray-700/40 text-gray-200 hover:bg-gray-600/20"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
              >
                <PlusCircle className="mr-2" />
                Add Account
              </Button>
            </div>
          </div>

          {/* Accounts List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((acc) => (
              <Card
                key={acc._id}
                className="rounded-2xl shadow-xl p-6 hover:scale-[1.02] transition"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94))",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {acc.type === "Wallet" ? (
                      <Wallet className="text-blue-500 w-8 h-8" />
                    ) : acc.type === "Credit Card" ? (
                      <CreditCard className="text-purple-500 w-8 h-8" />
                    ) : (
                      <Banknote className="text-green-500 w-8 h-8" />
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {acc.name}
                      </h3>
                      <p className="text-sm text-gray-500">{acc.type}</p>
                    </div>
                  </div>

                  {/* BALANCE + DELETE (ONLY ADDITION) */}
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{acc.balance.toLocaleString("en-IN")}
                    </p>

                    <button
                      onClick={() => deleteAccount(acc._id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete account"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
















// import DashboardLayout from "../layouts/DashboardLayout";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Button } from "../components/ui/button";
// import { Card, CardContent } from "../components/ui/card";
// import {
//   PlusCircle,
//   Wallet,
//   Banknote,
//   CreditCard,
//   BarChart3,
//   RefreshCcw,
// } from "lucide-react";
// import { toast } from "sonner";

// const AccountsPage = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [form, setForm] = useState({ name: "", type: "", balance: "" });
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   const fetchAccounts = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user._id) return;

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/accounts?userId=${user._id}`
//       );
//       setAccounts(res.data);
//     } catch (err) {
//       console.error("Error fetching accounts:", err);
//     }
//   };

//   const addAccount = async (e) => {
//     e.preventDefault();
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user._id) {
//       toast.error("Please log in first!");
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post("http://localhost:5000/api/accounts/add", {
//         ...form,
//         userId: user._id,
//       });

//       setForm({ name: "", type: "", balance: "" });
//       setShowForm(false);
//       fetchAccounts();
//       toast.success("Account added successfully!");
//     } catch (err) {
//       console.error("Error adding account:", err);
//       toast.error("Failed to add account");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAccounts();
//   }, []);

//   const totalBalance = accounts.reduce(
//     (acc, cur) => acc + (cur.balance || 0),
//     0
//   );

//   return (
//     <DashboardLayout>
//       <div className="p-6 text-white">

//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">My Accounts</h1>
//             <p className="text-gray-400">
//               View and manage all your accounts in one place
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button
//               onClick={fetchAccounts}
//               variant="outline"
//               className="flex items-center border-gray-700 text-gray-200 hover:bg-gray-800"
//             >
//               <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
//             </Button>

//             <Button
//               onClick={() => setShowForm(!showForm)}
//               className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
//             >
//               <PlusCircle className="mr-2 w-5 h-5" /> Add Account
//             </Button>
//           </div>
//         </div>

//         {/* OVERVIEW CARDS */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

//           <Card className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl text-white">
//             <CardContent className="p-6">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm opacity-80">Total Balance</p>
//                   <h2 className="text-2xl font-bold mt-2">
//                     ₹{totalBalance.toLocaleString("en-IN")}
//                   </h2>
//                 </div>
//                 <BarChart3 className="w-10 h-10 opacity-80" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-[#111218] border border-gray-800 rounded-2xl shadow-lg">
//             <CardContent className="p-6 text-gray-200 flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-400">Accounts Linked</p>
//                 <h2 className="text-xl font-bold mt-2">{accounts.length}</h2>
//               </div>
//               <Wallet className="text-blue-500 w-8 h-8" />
//             </CardContent>
//           </Card>

//           <Card className="bg-[#111218] border border-gray-800 rounded-2xl shadow-lg">
//             <CardContent className="p-6 text-gray-200 flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-400">Bank Accounts</p>
//                 <h2 className="text-xl font-bold mt-2">
//                   {accounts.filter((a) => a.type === "Bank").length}
//                 </h2>
//               </div>
//               <Banknote className="text-green-500 w-8 h-8" />
//             </CardContent>
//           </Card>

//           <Card className="bg-[#111218] border border-gray-800 rounded-2xl shadow-lg">
//             <CardContent className="p-6 text-gray-200 flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-400">Credit Cards</p>
//                 <h2 className="text-xl font-bold mt-2">
//                   {accounts.filter((a) => a.type === "Credit Card").length}
//                 </h2>
//               </div>
//               <CreditCard className="text-purple-500 w-8 h-8" />
//             </CardContent>
//           </Card>

//         </div>

//         {/* ADD ACCOUNT FORM */}
//         {showForm && (
//           <Card className="mb-6 bg-[#0f1115] border border-gray-800 rounded-2xl shadow-xl">
//             <form
//               onSubmit={addAccount}
//               className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6"
//             >
//               <input
//                 type="text"
//                 placeholder="Account Name"
//                 className="bg-[#1a1c22] border border-gray-700 text-white rounded-lg p-3"
//                 value={form.name}
//                 onChange={(e) =>
//                   setForm({ ...form, name: e.target.value })
//                 }
//                 required
//               />

//               <select
//                 className="bg-[#1a1c22] border border-gray-700 text-white rounded-lg p-3"
//                 value={form.type}
//                 onChange={(e) =>
//                   setForm({ ...form, type: e.target.value })
//                 }
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="Bank">Bank</option>
//                 <option value="Wallet">Wallet</option>
//                 <option value="Credit Card">Credit Card</option>
//                 <option value="Investment">Investment</option>
//               </select>

//               <input
//                 type="number"
//                 placeholder="Balance"
//                 className="bg-[#1a1c22] border border-gray-700 text-white rounded-lg p-3"
//                 value={form.balance}
//                 onChange={(e) =>
//                   setForm({ ...form, balance: e.target.value })
//                 }
//                 required
//               />

//               <Button
//                 type="submit"
//                 className="bg-green-600 hover:bg-green-700 text-white col-span-full rounded-lg"
//               >
//                 {loading ? "Adding..." : "Add Account"}
//               </Button>
//             </form>
//           </Card>
//         )}

//         {/* ACCOUNTS LIST */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {accounts.map((acc) => (
//             <Card
//               key={acc._id}
//               className="bg-[#111218] border border-gray-800 rounded-2xl p-6 shadow-lg hover:border-gray-600 transition-all"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   {acc.type === "Wallet" ? (
//                     <Wallet className="text-blue-500 w-8 h-8" />
//                   ) : acc.type === "Credit Card" ? (
//                     <CreditCard className="text-purple-500 w-8 h-8" />
//                   ) : (
//                     <Banknote className="text-green-500 w-8 h-8" />
//                   )}

//                   <div>
//                     <h3 className="font-semibold text-white">{acc.name}</h3>
//                     <p className="text-sm text-gray-400">{acc.type}</p>
//                   </div>
//                 </div>

//                 <p className="text-lg font-bold text-white">
//                   ₹{acc.balance.toLocaleString("en-IN")}
//                 </p>
//               </div>
//             </Card>
//           ))}
//         </div>

//       </div>
//     </DashboardLayout>
//   );
// };

// export default AccountsPage;

// import DashboardLayout from "../layouts/DashboardLayout";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Button } from "../components/ui/button";
// import { Card, CardContent } from "../components/ui/card";
// import {
//   PlusCircle,
//   Wallet,
//   Banknote,
//   CreditCard,
//   BarChart3,
//   RefreshCcw,
// } from "lucide-react";
// import { toast } from "sonner";

// const AccountsPage = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [form, setForm] = useState({ name: "", type: "", balance: "" });
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   const fetchAccounts = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user._id) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/accounts?userId=${user._id}`
//       );
//       setAccounts(res.data);
//     } catch (err) {
//       console.error("Error fetching accounts:", err);
//     }
//   };

//   const addAccount = async (e) => {
//     e.preventDefault();
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user._id) {
//       toast.error("Please log in first!");
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post("http://localhost:5000/api/accounts/add", {
//         ...form,
//         userId: user._id,
//       });
//       setForm({ name: "", type: "", balance: "" });
//       setShowForm(false);
//       fetchAccounts();
//       toast.success("✅ Account added successfully!");
//     } catch (err) {
//       console.error("Error adding account:", err);
//       toast.error("Failed to add account");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAccounts();
//   }, []);

//   const totalBalance = accounts.reduce((acc, cur) => acc + (cur.balance || 0), 0);

//   return (
//     <DashboardLayout>
//       <div className="p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">My Accounts</h1>
//             <p className="text-gray-500">
//               Track all your financial accounts in one unified view
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <Button
//               onClick={fetchAccounts}
//               variant="outline"
//               className="flex items-center"
//             >
//               <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
//             </Button>
//             <Button
//               onClick={() => setShowForm(!showForm)}
//               className="bg-blue-600 text-white flex items-center"
//             >
//               <PlusCircle className="mr-2 w-5 h-5" /> Add Account
//             </Button>
//           </div>
//         </div>

//         {/* Overview */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg rounded-2xl">
//             <CardContent className="p-6">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm opacity-80">Total Balance</p>
//                   <h2 className="text-2xl font-bold mt-2">
//                     ₹{totalBalance.toLocaleString("en-IN")}
//                   </h2>
//                 </div>
//                 <BarChart3 className="w-8 h-8 opacity-70" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-white border rounded-2xl shadow-sm">
//             <CardContent className="p-6 flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-500">Accounts Linked</p>
//                 <h2 className="text-xl font-semibold mt-2">{accounts.length}</h2>
//               </div>
//               <Wallet className="text-blue-600 w-8 h-8" />
//             </CardContent>
//           </Card>

//           <Card className="bg-white border rounded-2xl shadow-sm">
//             <CardContent className="p-6 flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-500">Bank Accounts</p>
//                 <h2 className="text-xl font-semibold mt-2">
//                   {accounts.filter((a) => a.type === "Bank").length}
//                 </h2>
//               </div>
//               <Banknote className="text-green-600 w-8 h-8" />
//             </CardContent>
//           </Card>

//           <Card className="bg-white border rounded-2xl shadow-sm">
//             <CardContent className="p-6 flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-500">Credit Cards</p>
//                 <h2 className="text-xl font-semibold mt-2">
//                   {accounts.filter((a) => a.type === "Credit Card").length}
//                 </h2>
//               </div>
//               <CreditCard className="text-purple-600 w-8 h-8" />
//             </CardContent>
//           </Card>
//         </div>

//         {/* Add Account Form */}
//         {showForm && (
//           <Card className="mb-6 shadow-sm rounded-2xl">
//             <form
//               onSubmit={addAccount}
//               className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6"
//             >
//               <input
//                 type="text"
//                 placeholder="Account Name"
//                 className="border rounded-lg p-2"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//               <select
//                 className="border rounded-lg p-2"
//                 value={form.type}
//                 onChange={(e) => setForm({ ...form, type: e.target.value })}
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="Bank">Bank</option>
//                 <option value="Wallet">Wallet</option>
//                 <option value="Credit Card">Credit Card</option>
//                 <option value="Investment">Investment</option>
//               </select>
//               <input
//                 type="number"
//                 placeholder="Balance"
//                 className="border rounded-lg p-2"
//                 value={form.balance}
//                 onChange={(e) => setForm({ ...form, balance: e.target.value })}
//                 required
//               />
//               <Button
//                 type="submit"
//                 className="bg-green-600 text-white col-span-full rounded-lg"
//               >
//                 {loading ? "Adding..." : "Add Account"}
//               </Button>
//             </form>
//           </Card>
//         )}

//         {/* Account Cards */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {accounts.map((acc) => (
//             <CardContent
//               key={acc._id}
//               className="border rounded-2xl shadow-sm p-6 bg-white hover:shadow-md transition-all"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   {acc.type === "Wallet" ? (
//                     <Wallet className="text-blue-600 w-8 h-8" />
//                   ) : acc.type === "Credit Card" ? (
//                     <CreditCard className="text-purple-600 w-8 h-8" />
//                   ) : (
//                     <Banknote className="text-green-600 w-8 h-8" />
//                   )}
//                   <div>
//                     <h3 className="font-semibold text-gray-800">{acc.name}</h3>
//                     <p className="text-sm text-gray-500">{acc.type}</p>
//                   </div>
//                 </div>
//                 <p className="text-lg font-bold text-gray-900">
//                   ₹{acc.balance.toLocaleString("en-IN")}
//                 </p>
//               </div>
//             </CardContent>
//           ))}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default AccountsPage;


