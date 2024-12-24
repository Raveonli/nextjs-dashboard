import React from "react";
import { Shield, Sword, Droplet } from "lucide-react";

type GameCardProps = {
  id: number;
  title: string;
  attack: number;
  mana: number;
  health: number;
  type: "amanita" | "boletus" | "russula" | "morels";
  imageUrl?: string;
  isSelected?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
};

export function GameCard({
  id,
  title,
  attack,
  mana,
  health,
  type,
  imageUrl = "/api/placeholder/200/200",
  isSelected = false,
  onDragStart,
}: GameCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "amanita":
        return "from-red-900 to-red-700 border-red-500";
      case "boletus":
        return "from-blue-900 to-blue-700 border-blue-500";
      case "russula":
        return "from-purple-900 to-purple-700 border-purple-500";
      case "morels":
        return "from-green-900 to-green-700 border-green-500";
      default:
        return "from-gray-900 to-gray-700 border-gray-500";
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        if (onDragStart) {
          onDragStart(e); // Call the onDragStart function if provided
        }
        e.dataTransfer.setData("number", id.toString()); // Set the dragged data
      }}
      className={`
        relative w-48 h-66 rounded-xl border-2 overflow-hidden 
        transition-all duration-200 hover:scale-105
        ${isSelected ? "ring-4 ring-blue-500" : "hover:shadow-xl"}
        ${getTypeStyles()}
      `}
    >
      {/* Card Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${getTypeStyles()} opacity-90`}
      ></div>

      {/* Card Content */}
      <div className="relative h-full flex flex-col">
        {/* Card Header */}
        <div className="px-3 py-2 text-center bg-black/30">
          <h3 className="text-lg font-bold text-white truncate">{title}</h3>
          <p className="text-sm text-white/80 capitalize">{type}</p>
        </div>
        {/* Card Image */}
        <div className="flex-grow p-2">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
        {/* Value Display */}

        <div className="mt-auto p-3 bg-black/30">
          <div className="flex justify-between text-white">
            <div className="flex items-center gap-1">
              <Sword size={16} className="text-red-400" />
              <span className="text-xl font-bold text-white">
                {attack}
              </span>{" "}
            </div>
            <div className="flex items-center gap-1">
              <Droplet size={16} className="text-blue-400" />
              <span className="text-xl font-bold text-white">{mana}</span>{" "}
            </div>
            <div className="flex items-center gap-1">
              <Shield size={16} className="text-green-400" />
              <span className="text-xl font-bold text-white">
                {health}
              </span>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
