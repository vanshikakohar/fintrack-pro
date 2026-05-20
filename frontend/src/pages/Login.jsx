import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});


      let data = {};
      try {
        data = await res.json(); // ✅ SAFE PARSE
      } catch {}

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setMessage(data.message || "❌ Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server error, please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Login
        </button>

        {message && <p className="text-center mt-4">{message}</p>}

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

// const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await fetch("/api/auth/login", {
    

//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//    if (res.ok) {
//   localStorage.setItem("token", data.token);
//   localStorage.setItem("user", JSON.stringify(data.user)); // ✅ add this
//   setMessage("✅ Login successful!");
//   setTimeout(() => navigate("/dashboard"), 1000);
// }
//  else {
//       setMessage(data.message || "❌ Login failed");
//     }
//   } catch (err) {
//     console.error(err);
//     setMessage("⚠️ Server error, please try again.");
//   }
// };


//   return (
//     <div className="flex items-center justify-center min-h-screen bg-blue-100">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-8 rounded-2xl shadow-lg w-96"
//       >
//         <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
//           Login
//         </h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Login
//         </button>

//         {message && (
//           <p className="text-center mt-4 text-gray-700 font-medium">{message}</p>
//         )}

//         <p className="text-center mt-4 text-gray-700">
//           Don’t have an account?{" "}
//           <Link to="/register" className="text-blue-600 hover:underline">
//             Register here
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;
