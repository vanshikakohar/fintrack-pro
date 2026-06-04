import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Analytics from "./pages/Analytics";
import Documents from "./pages/Documents";
import Landing from "./pages/Landing";
import Accounts from "./pages/Accounts";
import Profile from "./pages/Profile";
import Splitwise from "./pages/Splitwise";
import SplitwiseGroup from "./pages/SplitwiseGroup";
import SettingsPage from "./pages/Settings";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/accounts" element={<Accounts />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/splitwise" element={<Splitwise />} />
        <Route path="/splitwise/group/:groupId" element={<SplitwiseGroup />} />
        <Route path="/settings" element={<SettingsPage />} />

      </Routes>

      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Transactions from "./pages/Transactions";
// import Budgets from "./pages/Budgets";
// import Analytics from "./pages/Analytics";
// import Upload from "./pages/Upload";
// import Documents from "./pages/Documents";
// import Landing from "./pages/Landing";
// import Accounts from "./pages/Accounts";
// import FinanceAI from "./pages/FinanceAI";
// import { Toaster } from "sonner";
// import Profile from "./pages/Profile";
// import Splitwise from "./pages/Splitwise";
// import SplitwiseGroup from "./pages/SplitwiseGroup";

// function App() {
//   return (
//     <>
//       <Router>
//         <Routes>
//           {/* Landing Page */}
//           <Route path="/" element={<Landing />} />

//           {/* Auth Routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* App Pages */}
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/transactions" element={<Transactions />} />
//           <Route path="/budgets" element={<Budgets />} />
//           <Route path="/analytics" element={<Analytics />} />
//           <Route path="/documents" element={<Documents />} />
//           <Route path="/upload" element={<Upload />} />
//           <Route path="/accounts" element={<Accounts />} />
//           <Route path="/ai" element={<FinanceAI />} />
//           <Route path="/profile" element={<Profile />} />

//           {/* Splitwise */}
//           <Route path="/splitwise" element={<Splitwise />} />
//           <Route path="/splitwise/group/:groupId" element={<SplitwiseGroup />} />
//         </Routes>
//       </Router>

//       <Toaster richColors position="top-center" />
//     </>
//   );
// }

// export default App;
