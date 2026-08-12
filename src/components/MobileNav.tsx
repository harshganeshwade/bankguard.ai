import React from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  Activity,
  Skull,
  SearchCode,
  Users,
} from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  onTabSelect: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabSelect,
}) => {
  const items = [
    { id: "dash", label: "Command", icon: LayoutDashboard },
    { id: "fraud", label: "Fraud", icon: ShieldAlert },
    { id: "activity", label: "Transactions", icon: Activity },
    { id: "investigate", label: "Cases", icon: SearchCode },
    { id: "attack-lab", label: "Lab", icon: Skull },
    { id: "clients", label: "Customers", icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F141D] border-t border-[#202938] z-40 px-2 py-1.5 flex justify-around items-center">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabSelect(item.id)}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-sky-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
