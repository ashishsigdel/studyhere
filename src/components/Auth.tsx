"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Auth() {
  const [key, setKey] = useState("");

  // Load the key from localStorage when the component mounts
  useEffect(() => {
    const storedKey = localStorage.getItem("authKey");
    if (storedKey) {
      setKey(storedKey);
    }
  }, []);

  // Save the key to localStorage whenever it changes
  const handleSaveKey = () => {
    localStorage.setItem("authKey", key);
    toast.success("Key saved to localStorage!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Auth for create</h1>
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter your key"
        style={{ padding: "10px", marginRight: "10px" }}
      />
      <button onClick={handleSaveKey} style={{ padding: "10px" }}>
        Save Key
      </button>
    </div>
  );
}
