import React, { useState, useRef } from "react";

type PropsHoverButton = {
  Icon: React.ReactNode;
  direction: "top" | "left" | "bottom" | "right";
  hoverText: string;
  onClick?: () => void;
  backGround?: boolean;
};

export function HoverButton({
  Icon,
  direction,
  hoverText,
  onClick,
  backGround,
}: PropsHoverButton) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get button position for fixed tooltip
  const getTooltipPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };

    const rect = buttonRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    switch (direction) {
      case "top":
        return {
          top: rect.top + scrollY - 20,
          left: rect.left + scrollX + rect.width / 2,
          transform: "translateX(-50%) translateY(-8px)",
        };
      case "bottom":
        return {
          top: rect.top + scrollY + rect.height,
          left: rect.left + scrollX + rect.width / 2,
          transform: "translateX(-50%) translateY(8px)",
        };
      case "left":
        return {
          top: rect.top + scrollY + rect.height / 2,
          left: rect.left + scrollX - 8,
          transform: "translateX(-100%) translateY(-50%)",
        };
      case "right":
        return {
          top: rect.top + scrollY + rect.height / 2,
          left: rect.left + scrollX + rect.width + 8,
          transform: "translateY(-50%) translateX(8px)",
        };
      default:
        return { top: 0, left: 0 };
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-1 ${
        backGround &&
        "bg-white-light-variant dark:bg-dark-light-variant rounded-md"
      } relative`}
    >
      {Icon}
      {isHovered && (
        <div
          className="fixed z-50 opacity-0 scale-90 whitespace-nowrap bg-white-variant dark:bg-dark-variant border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-md text-xs transition-all duration-300 pointer-events-none"
          style={{
            ...getTooltipPosition(),
            opacity: isHovered ? 1 : 0,
            transform: `${getTooltipPosition().transform} scale(${
              isHovered ? 1 : 0.9
            })`,
          }}
        >
          {hoverText}
        </div>
      )}
    </button>
  );
}

type ButtonSimpleType = {
  title: string;
  onClick?: () => void;
};

export function ButtonSimple({ title, onClick }: ButtonSimpleType) {
  return (
    <button
      onClick={onClick}
      className="mt-5 p-1 bg-black text-white dark:bg-white dark:text-black rounded-full px-7 py-2 w-fit"
    >
      {title}
    </button>
  );
}
