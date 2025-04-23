"use client";
import axios from "axios";
import React, { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return <div>Page</div>;
}
