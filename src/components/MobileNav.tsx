import React from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  Network,
  Skull,
  Activity,
} from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  onTabSelect: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabSelect,
}) => {
  const tabs = [
    { id: "dash", label: "Dash", icon: LayoutDashboard },
    { id: "fraud", label: "Fraud", icon: ShieldAlert },
    { id: "mule-graph", label: "Mule Graph", icon: Network },
    { id: "attack-lab", label: "Attack Lab", icon: Skull },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#122131] border-t border-[#334155] flex justify-around items-center h-16 px-2">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onTabSelect(t.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-transform active:scale-95 ${
              isActive
                ? "bg-[#3e495d] text-[#38BDF8] font-bold"
                : "text-[#c6c6cd] hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-wider">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
