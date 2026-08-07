import React from "react";
import { AlertCircle } from "lucide-react";

interface TickerProps {
  alerts: string[];
}

export const Ticker: React.FC<TickerProps> = ({ alerts }) => {
  const defaultAlerts = [
    "ALERT: Multiple failed login attempts originating from IP 192.168.1.105 (Kolkata, WB) targeting account #5512-9901-8811.",
    "ALERT: Suspicious wire transfer of ₹15,400 flagged for manual review on account #4592-0012-8921.",
    "ALERT: Velocity check failed for card ending in 4492 - 8 transactions in 45 seconds.",
    "ALERT: Impossible travel detected - Login in Bengaluru, KA followed by transaction in Guwahati, AS (2,800 km).",
  ];

  const list = alerts.length > 0 ? alerts : defaultAlerts;

  return (
    <div className="fixed top-14 w-full z-40 border-b border-[#334155] bg-[#0d1c2d] text-[#c6c6cd] font-mono text-xs h-8 flex items-center overflow-hidden">
      <div className="bg-[#EF4444] text-white px-3 h-full flex items-center gap-1.5 font-bold tracking-wider z-10 shrink-0 shadow-md">
        <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
        <span>LIVE THREAT FEED</span>
      </div>

      <div className="ticker-wrap flex-1 overflow-hidden relative h-full flex items-center">
        <div className="animate-ticker flex whitespace-nowrap gap-8 pl-4">
          {list.concat(list).map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <span className="text-[#EF4444] font-bold">ALERT:</span>
              <span className="text-[#d4e4fa]">{item.replace("ALERT:", "")}</span>
              <span className="text-[#334155] mx-2">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
