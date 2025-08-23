// src/components/Secrets.jsx
import React, { useEffect, useState } from "react";
import { listSecrets, createSecret, updateSecret, deleteSecret } from "../services/secretService";

export default function Secrets() {
  const [secrets, setSecrets] = useState([]);
  const [title, setTitle] = useState("");
  const [data, setData] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editData, setEditData] = useState("");

  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    const res = await listSecrets();
    setSecrets(res);
  };

  const handleCreate = async () => {
    if (!title || !data) return;
    await createSecret(title, data);
    setTitle(""); 
    setData("");
    fetchSecrets();
  };

  const handleDelete = async (id) => {
    await deleteSecret(id);
    fetchSecrets();
  };

  const startEdit = (secret) => {
    setEditingId(secret.id);
    setEditTitle(secret.title);
    setEditData(secret.data);
  };

  const handleUpdate = async () => {
    if (!editTitle || !editData) return;
    await updateSecret(editingId, editTitle, editData);
    setEditingId(null);
    setEditTitle("");
    setEditData("");
    fetchSecrets();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditData("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Secrets</h2>

      {/* Create Secret */}
      <div className="mb-6 flex flex-col md:flex-row gap-2">
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded border bg-gray-800 border-gray-600 text-white flex-1"
        />
        <input 
          type="text" 
          placeholder="Secret" 
          value={data} 
          onChange={(e) => setData(e.target.value)}
          className="p-2 rounded border bg-gray-800 border-gray-600 text-white flex-1"
        />
        <button 
          onClick={handleCreate} 
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Add Secret
        </button>
      </div>

      {/* Secrets List */}
      <ul className="space-y-4">
        {secrets.map((s) => (
          <li key={s.id} className="bg-gray-800 p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            {editingId === s.id ? (
              <>
                <input 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="p-2 rounded border bg-gray-700 border-gray-600 text-white flex-1"
                />
                <input 
                  value={editData} 
                  onChange={(e) => setEditData(e.target.value)}
                  className="p-2 rounded border bg-gray-700 border-gray-600 text-white flex-1"
                />
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">Save</button>
                  <button onClick={cancelEdit} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>{s.title}:</strong> {s.data}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(s)} className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
