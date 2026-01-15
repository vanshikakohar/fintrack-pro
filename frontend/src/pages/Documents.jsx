import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { UploadCloud, Trash2 } from "lucide-react";

export default function Documents() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const fileInputRef = useRef(null);

  // 🔥 Load documents from backend
  const loadDocuments = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/documents", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDocuments(data);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setStatus("⏳ Uploading & analyzing...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus(`✅ ${data.message} (${data.transactionsAdded} entries)`);
      setFile(null);
      fileInputRef.current.value = "";
      loadDocuments(); // 🔥 refresh list
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // 🔥 DELETE DOCUMENT + TRANSACTIONS
  const deleteDocument = async (id) => {
    if (!window.confirm("Delete this document and its transactions?")) return;

    const token = localStorage.getItem("token");
    await fetch(`/api/documents/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadDocuments();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64">
        <Sidebar />
      </div>

      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-gray-600 mb-6">
            Upload bank statements and auto-import transactions.
          </p>

          {/* Upload box */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed p-10 bg-white rounded-xl text-center shadow"
          >
            <UploadCloud className="mx-auto mb-4 text-blue-600" size={48} />

            <input
              type="file"
              accept=".pdf,.csv,.xlsx,.xls"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />

            <label
              htmlFor="fileUpload"
              className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded"
            >
              Choose File
            </label>

            {file && <p className="mt-3">📄 {file.name}</p>}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="block mx-auto mt-4 bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
            >
              {uploading ? "Processing..." : "Upload & Analyze"}
            </button>

            {status && <p className="mt-3">{status}</p>}
          </div>

          {/* Documents Table */}
          <div className="mt-10 bg-white rounded shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">File</th>
                  <th className="p-3 text-left">Uploaded</th>
                  <th className="p-3 text-left">Transactions</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d._id} className="border-t">
                    <td className="p-3">{d.fileName}</td>
                    <td className="p-3">
                      {new Date(d.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3">{d.transactionsCount}</td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteDocument(d._id)}
                        className="text-red-600 flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!documents.length && (
                  <tr>
                    <td colSpan="4" className="p-5 text-center text-gray-500">
                      No documents uploaded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// import React, { useState, useRef } from "react";
// import Sidebar from "../components/Sidebar";
// import { UploadCloud } from "lucide-react";

// export default function Documents() {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [uploadHistory, setUploadHistory] = useState([]);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setStatus("");
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];
//     setFile(droppedFile);
//     setStatus("");
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please choose a file first");
//       return;
//     }

//     // ⚠️ Prevent WhatsApp image PDFs
//     if (file.type === "application/pdf" && file.size < 50_000) {
//       alert(
//         "This PDF looks like an image. Please upload a real bank statement PDF."
//       );
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("You are not logged in");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     setUploading(true);
//     setStatus("⏳ Uploading and analyzing...");

//     try {
//       // ✅ USE VITE PROXY (NO HARD-CODED URL)
//       const res = await fetch("/api/upload", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Upload failed");
//       }

//       setStatus(
//         `✅ ${data.message}. Added ${data.transactionsAdded} transactions.`
//       );

//       setUploadHistory((prev) => [
//         {
//           name: file.name,
//           time: new Date().toLocaleString(),
//           status: "success",
//         },
//         ...prev,
//       ]);

//       setFile(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     } catch (err) {
//       setStatus(`❌ ${err.message || "Failed to process file"}`);

//       setUploadHistory((prev) => [
//         {
//           name: file.name,
//           time: new Date().toLocaleString(),
//           status: "error",
//         },
//         ...prev,
//       ]);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64">
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-10 overflow-y-auto">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Upload Documents
//           </h1>
//           <p className="text-gray-600 mb-8">
//             Upload your bank statements (PDF, CSV, Excel) and FinTrack will
//             automatically extract & categorize your expenses.
//           </p>

//           {/* Upload Box */}
//           <div
//             className="border-2 border-dashed border-gray-300 bg-white rounded-xl p-12 text-center shadow-md hover:shadow-lg transition-all"
//             onDrop={handleDrop}
//             onDragOver={(e) => e.preventDefault()}
//           >
//             <UploadCloud size={60} className="mx-auto text-blue-600 mb-4" />

//             <p className="text-gray-600 mb-4">
//               Drag & drop your file here, or click below to upload
//             </p>

//             <input
//               type="file"
//               accept=".pdf,.csv,.xlsx,.xls"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               className="hidden"
//               id="fileUpload"
//             />

//             <label
//               htmlFor="fileUpload"
//               className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
//             >
//               Choose File
//             </label>

//             {file && (
//               <p className="mt-4 text-sm text-gray-800 font-medium">
//                 📄 {file.name}
//               </p>
//             )}

//             <button
//               onClick={handleUpload}
//               disabled={!file || uploading}
//               className={`mt-6 px-6 py-2 rounded-lg text-white transition ${
//                 uploading || !file
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               {uploading ? "Processing..." : "Upload & Analyze"}
//             </button>

//             {status && (
//               <p className="mt-4 text-gray-800 text-sm font-semibold">
//                 {status}
//               </p>
//             )}
//           </div>

//           {/* Upload History */}
//           {uploadHistory.length > 0 && (
//             <div className="mt-10">
//               <h2 className="text-lg font-semibold text-gray-900 mb-3">
//                 Recent Uploads
//               </h2>

//               <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                 <table className="min-w-full text-sm">
//                   <thead className="bg-gray-100 text-gray-700">
//                     <tr>
//                       <th className="py-3 px-5 text-left">File Name</th>
//                       <th className="py-3 px-5 text-left">Uploaded At</th>
//                       <th className="py-3 px-5 text-left">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {uploadHistory.map((item, i) => (
//                       <tr key={i} className="border-t">
//                         <td className="py-3 px-5">{item.name}</td>
//                         <td className="py-3 px-5">{item.time}</td>
//                         <td
//                           className={`py-3 px-5 font-medium ${
//                             item.status === "success"
//                               ? "text-green-600"
//                               : "text-red-600"
//                           }`}
//                         >
//                           {item.status}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// import React, { useState, useRef } from "react";
// import Sidebar from "../components/Sidebar";
// import { UploadCloud } from "lucide-react";

// export default function Documents() {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [uploadHistory, setUploadHistory] = useState([]);
//   const fileInputRef = useRef();

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setStatus("");
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];
//     setFile(droppedFile);
//     setStatus("");
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Please choose a file first");

//     const token = localStorage.getItem("token");
//     const formData = new FormData();
//     formData.append("file", file);

//     setUploading(true);
//     setStatus("⏳ Uploading and analyzing...");

//     try {
//       const res = await fetch("http://localhost:5000/api/upload", {

//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setStatus(`✅ ${data.message}. Added ${data.transactionsAdded} transactions.`);

//       setUploadHistory((prev) => [
//         { name: file.name, time: new Date().toLocaleString(), status: "success" },
//         ...prev,
//       ]);

//       setFile(null);
//       fileInputRef.current.value = "";
//     } catch (err) {
//       setStatus("❌ Failed to process file");

//       setUploadHistory((prev) => [
//         { name: file.name, time: new Date().toLocaleString(), status: "error" },
//         ...prev,
//       ]);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64">
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-10 overflow-y-auto">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-3xl font-bold text-gray-900">Upload Documents</h1>
//           <p className="text-gray-600 mb-8">
//             Upload your bank statements (PDF, CSV, Excel) and FinTrack will automatically extract & categorize your expenses.
//           </p>

//           {/* Upload Box */}
//           <div
//             className="border-2 border-dashed border-gray-300 bg-white rounded-xl p-12 text-center shadow-md hover:shadow-lg transition-all"
//             onDrop={handleDrop}
//             onDragOver={(e) => e.preventDefault()}
//           >
//             <UploadCloud size={60} className="mx-auto text-blue-600 mb-4" />
//             <p className="text-gray-600 mb-4">
//               Drag & drop your file here, or click below to upload
//             </p>

//             <input
//               type="file"
//               accept=".pdf,.csv,.xlsx,.xls"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               className="hidden"
//               id="fileUpload"
//             />

//             <label
//               htmlFor="fileUpload"
//               className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
//             >
//               Choose File
//             </label>

//             {file && (
//               <p className="mt-4 text-sm text-gray-800 font-medium">📄 {file.name}</p>
//             )}

//             <button
//               onClick={handleUpload}
//               disabled={!file || uploading}
//               className={`mt-6 px-6 py-2 rounded-lg text-white transition ${
//                 uploading || !file
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               {uploading ? "Processing..." : "Upload & Analyze"}
//             </button>

//             {status && (
//               <p className="mt-4 text-gray-800 text-sm font-semibold">{status}</p>
//             )}
//           </div>

//           {/* Upload History */}
//           {uploadHistory.length > 0 && (
//             <div className="mt-10">
//               <h2 className="text-lg font-semibold text-gray-900 mb-3">
//                 Recent Uploads
//               </h2>
//               <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                 <table className="min-w-full text-sm">
//                   <thead className="bg-gray-100 text-gray-700">
//                     <tr>
//                       <th className="py-3 px-5 text-left">File Name</th>
//                       <th className="py-3 px-5 text-left">Uploaded At</th>
//                       <th className="py-3 px-5 text-left">Status</th>
//                     </tr>
//                   </thead>
// <tbody>
//   {uploadHistory.map((item, i) => (
//     <tr key={i} className="border-t">
//       <td className="py-3 px-5">
//         {item.fileUrl ? (
//           <a
//             href={item.fileUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:underline"
//           >
//             {item.name}
//           </a>
//         ) : (
//           item.name
//         )}
//       </td>
//       <td className="py-3 px-5">{item.time}</td>
//       <td
//         className={`py-3 px-5 font-medium ${
//           item.status === "success" ? "text-green-600" : "text-red-600"
//         }`}
//       >
//         {item.status}
//       </td>
//     </tr>
//   ))}
// </tbody>

//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }


















// import React, { useState, useRef } from "react";
// import { UploadCloud } from "lucide-react";

// export default function Documents() {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [uploadHistory, setUploadHistory] = useState([]);
//   const fileInputRef = useRef();

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setStatus("");
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];
//     setFile(droppedFile);
//     setStatus("");
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Please choose a file first");
//     const token = localStorage.getItem("token");
//     const formData = new FormData();
//     formData.append("file", file);

//     setUploading(true);
//     setStatus("Uploading and analyzing...");

//     try {
//       const res = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setStatus(`✅ ${data.message}. Added ${data.transactionsAdded} transactions.`);
//       setUploadHistory((prev) => [
//         { name: file.name, time: new Date().toLocaleString(), status: "success" },
//         ...prev,
//       ]);
//       setFile(null);
//       fileInputRef.current.value = "";
//     } catch (err) {
//       console.error(err);
//       setStatus("❌ Failed to process file");
//       setUploadHistory((prev) => [
//         { name: file.name, time: new Date().toLocaleString(), status: "error" },
//         ...prev,
//       ]);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#f9fafc]">
//       {/* Sidebar Placeholder */}
//       <aside className="w-64 bg-[#0b1f55] text-white p-6 space-y-6">
//         <h2 className="text-2xl font-bold">FinTrack</h2>
//         <nav className="space-y-3">
//           <a href="/dashboard" className="block text-gray-300 hover:text-white">
//             Dashboard
//           </a>
//           <a href="/transactions" className="block text-gray-300 hover:text-white">
//             Transactions
//           </a>
//           <a href="/budgets" className="block text-gray-300 hover:text-white">
//             Budgets
//           </a>
//           <a href="/documents" className="block bg-blue-800 p-2 rounded text-white font-medium">
//             Documents
//           </a>
//           <a href="/analytics" className="block text-gray-300 hover:text-white">
//             Analytics
//           </a>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-10">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-2xl font-semibold text-gray-900">
//             Upload Financial Statements
//           </h1>
//           <p className="text-gray-600 mb-8">
//             Upload bank, credit card, and investment statements to automatically track expenses.
//           </p>

//           {/* Upload Box */}
//           <div
//             className="border-2 border-dashed border-gray-300 bg-white rounded-xl p-12 text-center shadow-sm hover:shadow-md transition-all"
//             onDrop={handleDrop}
//             onDragOver={(e) => e.preventDefault()}
//           >
//             <UploadCloud size={60} className="mx-auto text-blue-500 mb-4" />
//             <p className="text-gray-600 mb-4">
//               Drag & drop your file here, or click below to upload (PDF, CSV, XLSX)
//             </p>

//             <input
//               type="file"
//               accept=".pdf,.csv,.xlsx,.xls"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               className="hidden"
//               id="fileUpload"
//             />
//             <label
//               htmlFor="fileUpload"
//               className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
//             >
//               Choose File
//             </label>

//             {file && (
//               <p className="mt-4 text-sm text-gray-700">📄 {file.name}</p>
//             )}

//             <button
//               onClick={handleUpload}
//               disabled={!file || uploading}
//               className={`mt-6 px-6 py-2 rounded-lg text-white transition ${
//                 uploading || !file
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               {uploading ? "Processing..." : "Upload & Analyze"}
//             </button>

//             {status && (
//               <p className="mt-4 text-gray-700 text-sm font-medium">{status}</p>
//             )}
//           </div>

//           {/* Upload History */}
//           {uploadHistory.length > 0 && (
//             <div className="mt-10">
//               <h2 className="text-lg font-semibold text-gray-900 mb-3">
//                 Recent Uploads
//               </h2>
//               <div className="bg-white shadow rounded-lg overflow-hidden">
//                 <table className="min-w-full text-sm">
//                   <thead className="bg-gray-100 text-gray-700">
//                     <tr>
//                       <th className="py-3 px-5 text-left">File Name</th>
//                       <th className="py-3 px-5 text-left">Uploaded At</th>
//                       <th className="py-3 px-5 text-left">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {uploadHistory.map((item, i) => (
//                       <tr key={i} className="border-t">
//                         <td className="py-3 px-5">{item.name}</td>
//                         <td className="py-3 px-5">{item.time}</td>
//                         <td className="py-3 px-5 capitalize">{item.status}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
