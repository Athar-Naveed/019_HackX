import { TabButtonProps } from "@/types";

const TabButton = ({ active, onClick, icon, text }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-md ${
        active ? "bg-white text-brand-600 shadow-xs" : "text-gray-200 hover:text-brand-600 hover:bg-white/50"
      }`}
    >
      <span className={`flex items-center ${active ? "text-brand-600" : ""}`}>
        {icon}
        {text}
      </span>
    </button>
  )
}
export default TabButton;