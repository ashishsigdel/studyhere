"use client";
import axios from "axios";
import React, { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.mmrsports.com/api/v1/banners?size=1&type=featured",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return <div>Page</div>;
}
