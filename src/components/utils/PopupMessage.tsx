"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeMessage } from "@/redux/features/popupMessageSlice";

interface PopupMessageProps {
  messageShowOn: string | null;
  size?: "sm" | "md" | "lg";
}

const PopupMessage: React.FC<PopupMessageProps> = ({
  messageShowOn,
  size = "lg",
}) => {
  const dispatch = useDispatch();
  const { message, type, showOn } = useSelector(
    (state: RootState) => state.popupMessage
  );

  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [localType, setLocalType] = useState<
    "success" | "error" | "info" | "warning" | null
  >(null);
  const [localShowOn, setLocalShowOn] = useState<string | null>(null);

  useEffect(() => {
    if (message && showOn === messageShowOn) {
      setLocalMessage(message);
      setLocalType(type);
      setLocalShowOn(showOn);

      // Set timeout to clear the local message state after 5 seconds
      const timer = setTimeout(() => {
        dispatch(removeMessage());
        setLocalMessage(null);
        setLocalType(null);
        setLocalShowOn(null);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setLocalMessage(null);
      setLocalType(null);
      setLocalShowOn(null);
    }
  }, [message, type, showOn, messageShowOn, dispatch]);

  // If localMessage is null, do not render anything
  if (!localMessage) return null;

  // Render the popup message with appropriate styles based on type
  return (
    <div
      className={`w-full px-${
        size === "sm" ? "2" : size === "md" ? "4" : "6"
      } py-${size === "sm" ? "1" : size === "md" ? "2" : "3"} rounded z-50 mb-${
        size === "sm" ? "2" : size === "md" ? "4" : "6"
      } text-sm ${getTypeClass(localType)}`}
    >
      {localMessage}
    </div>
  );
};

// Utility function to get CSS class based on message type
const getTypeClass = (
  type: "success" | "error" | "info" | "warning" | null
): string => {
  switch (type) {
    case "success":
      return "bg-[#58b15c]/10 text-[#58b15c] border border-[#58b15c]";
    case "error":
      return "bg-[#f04f43]/10 text-[#f04f43] border border-[#f04f43]";
    case "info":
      return "bg-[#3899f0]/10 text-[#3899f0] border border-[#3899f0]";
    case "warning":
      return "bg-[#f9c758]/10 text-[#f9c758] border border-[#f9c758]";
    default:
      return "";
  }
};

export default PopupMessage;
