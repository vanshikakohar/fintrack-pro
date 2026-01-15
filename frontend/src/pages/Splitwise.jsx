import React, { useEffect, useState } from "react";
import axios from "../axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";

export default function Splitwise() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/split/groups");
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Unable to load groups");
    }
    setLoading(false);
  };

  const createGroup = async () => {
    if (!groupName || !members) return alert("Fill all fields");

    try {
      const formattedMembers = members
        .split(",")
        .map((m) => ({ name: m.trim() }));

      const res = await axios.post("/api/split/groups", {
        name: groupName,
        members: formattedMembers,
      });

      setGroupName("");
      setMembers("");

      await loadGroups();
      navigate(`/splitwise/group/${res.data._id}`);
    } catch (err) {
      console.error("createGroup:", err);
      alert("Error creating group");
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <div className="flex min-h-screen relative">

      {/* 🎨 BACKGROUND — same as dashboard */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1400px 800px at 20% 10%, rgba(67,56,202,0.12), transparent 14%)," +
              "radial-gradient(900px 500px at 85% 10%, rgba(220,95,255,0.06), transparent 20%)," +
              "linear-gradient(180deg,#03040a,#08030f,#060218)",
          }}
        />

        <div
          className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(circle at 25% 25%, rgba(124,58,237,0.22), rgba(124,58,237,0.08) 30%, transparent 60%)",
          }}
        />

        <div
          className="absolute bottom-[-300px] left-[-300px] w-[700px] h-[700px] rounded-full blur-2xl opacity-40"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(255,99,132,0.07), rgba(255,200,255,0.03) 20%, transparent 60%)",
          }}
        />
      </div>

      <Sidebar />

      <div className="flex-1 relative">
        <Topbar />

        <main className="relative z-10 p-8 space-y-8">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h1
              className="text-3xl font-extrabold"
              style={{
                background: "linear-gradient(90deg,#b892ff,#7c3aed,#7dd3fc)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Your Groups
            </h1>

            <motion.button
              onClick={createGroup}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-xl text-white shadow-lg"
              style={{
                background: "linear-gradient(90deg,#7c3aed,#4f46e5)",
              }}
            >
              <Plus size={16} className="inline-block mr-2" />
              Create Group
            </motion.button>
          </div>

          {/* CREATE GROUP CARD */}
          <div
            className="p-6 rounded-2xl shadow-xl space-y-4"
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h2 className="text-xl font-semibold">Create New Group</h2>

            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group Name"
              className="border p-3 rounded-xl w-full"
            />

            <input
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="Members (comma separated)"
              className="border p-3 rounded-xl w-full"
            />

            <button
              onClick={createGroup}
              className="px-4 py-2 rounded-xl text-white shadow"
              style={{
                background: "linear-gradient(90deg,#7c3aed,#4f46e5)",
              }}
            >
              Create Group
            </button>
          </div>

          {/* GROUP LIST */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">All Groups</h3>

            {loading ? (
              <p className="text-gray-300">Loading…</p>
            ) : groups.length === 0 ? (
              <p className="text-gray-400">No groups yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((g) => (
                  <motion.div
                    key={g._id}
                    whileHover={{ y: -6 }}
                    onClick={() => navigate(`/splitwise/group/${g._id}`)}
                    className="p-5 rounded-2xl cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.92))",
                      border: "1px solid rgba(255,255,255,0.06)",
                      boxShadow: "0 12px 35px rgba(2,6,23,0.5)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-semibold">{g.name}</div>
                      <div className="p-2 rounded-xl bg-indigo-600 text-white shadow">
                        <Users size={18} />
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {g.members.length} members
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
