import { JSX } from "react";
import { Tool } from "@/types/types";
import {
  Square,
  Circle,
  Pencil,
  Eraser,
} from "lucide-react";

interface ToolbarProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}

const toolIcons: Record<Tool, JSX.Element> = {
  [Tool.RECT]: <Square className="w-5 h-5" />,
  [Tool.CIRCLE]: <Circle className="w-5 h-5" />,
  [Tool.PENCIL]: <Pencil className="w-5 h-5" />,
  [Tool.ERASER]: <Eraser className="w-5 h-5" />,
};

export default function Toolbar({ selectedTool, setSelectedTool }: ToolbarProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2 bg-white p-2 rounded shadow">
      {Object.values(Tool).map((tool) => (
        <button
          type="button"
          key={tool}
          onClick={() => setSelectedTool(tool)}
          className={`p-2 rounded border flex items-center justify-center transition ${selectedTool === tool
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-black hover:bg-gray-200"
            }`}
          title={tool}
        >
          {toolIcons[tool]}
        </button>
      ))}
    </div>
  );
}