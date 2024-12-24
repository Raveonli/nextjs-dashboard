// PopupExample.tsx
import React from "react";

interface PopupProps {
  message: string;
  visible: boolean;
}

function Popup({ message, visible }: PopupProps) {
  return (
    visible && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="p-6 bg-white text-black rounded-lg shadow-lg">
          <p>{message}</p>
        </div>
      </div>
    )
  );
}

export default Popup;
