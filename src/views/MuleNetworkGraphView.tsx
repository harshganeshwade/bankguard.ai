import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Network,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Zap,
  Info,
  CheckCircle,
  XCircle,
  Download,
  Share2,
  Lock,
  ArrowRight,
  TrendingUp,
  Layers,
  CircleDot,
} from "lucide-react";
import { Customer, Transaction } from "../types";
import { exportToCsv } from "../utils/downloadReport";

interface MuleNetworkGraphViewProps {
  transactions?: Transaction[];
}

interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: "Primary" | "Mule Account" | "Shell Company" | "Crypto Exchange" | "ATM Cashout";
  riskScore: number;
  balance: number;
  flagged: boolean;
  totalInflow: number;
  totalOutflow: number;
  isCycleMember?: boolean;
}

interface LinkData extends d3.SimulationLinkDatum<NodeData> {
  id: string;
  source: string | NodeData;
  target: string | NodeData;
  amount: number;
  txCount: number;
  timestamp: string;
  isSuspicious: boolean;
  isCyclePath?: boolean;
}

const INITIAL_NODES: NodeData[] = [
  { id: "ACC-8921", name: "Vikramaditya Rao", type: "Primary", riskScore: 12, balance: 142850, flagged: false, totalInflow: 250000, totalOutflow: 107150 },
  { id: "ACC-9921", name: "Dr. Rajesh Mehta", type: "Primary", riskScore: 18, balance: 38200, flagged: false, totalInflow: 85000, totalOutflow: 46800 },
  { id: "ACC-1102", name: "Harsh Ganeshwade", type: "Primary", riskScore: 8, balance: 512900, flagged: false, totalInflow: 600000, totalOutflow: 87100 },
  { id: "ACC-3304", name: "Mule Account A (Shell)", type: "Mule Account", riskScore: 94, balance: 1200, flagged: true, totalInflow: 480000, totalOutflow: 478800, isCycleMember: true },
  { id: "ACC-4402", name: "Mule Account B (Fast Layer)", type: "Mule Account", riskScore: 91, balance: 800, flagged: true, totalInflow: 478800, totalOutflow: 478000, isCycleMember: true },
  { id: "ACC-5512", name: "Global Trading Corp (Shell)", type: "Shell Company", riskScore: 88, balance: 4500, flagged: true, totalInflow: 478000, totalOutflow: 473500, isCycleMember: true },
  { id: "ACC-7721", name: "Crypto Offramp Alpha", type: "Crypto Exchange", riskScore: 96, balance: 950000, flagged: true, totalInflow: 1200000, totalOutflow: 250000 },
  { id: "ACC-8812", name: "ATM Rapid Cashout Node", type: "ATM Cashout", riskScore: 92, balance: 0, flagged: true, totalInflow: 320000, totalOutflow: 320000 },
  { id: "ACC-6610", name: "Ananya Verma", type: "Primary", riskScore: 22, balance: 18400, flagged: false, totalInflow: 50000, totalOutflow: 31600 },
];

const INITIAL_LINKS: LinkData[] = [
  { id: "L1", source: "ACC-8921", target: "ACC-9921", amount: 15000, txCount: 2, timestamp: "10 mins ago", isSuspicious: false },
  { id: "L2", source: "ACC-1102", target: "ACC-3304", amount: 250000, txCount: 5, timestamp: "25 mins ago", isSuspicious: true },
  { id: "L3", source: "ACC-3304", target: "ACC-4402", amount: 245000, txCount: 8, timestamp: "20 mins ago", isSuspicious: true, isCyclePath: true },
  { id: "L4", source: "ACC-4402", target: "ACC-5512", amount: 240000, txCount: 6, timestamp: "15 mins ago", isSuspicious: true, isCyclePath: true },
  { id: "L5", source: "ACC-5512", target: "ACC-3304", amount: 235000, txCount: 4, timestamp: "5 mins ago", isSuspicious: true, isCyclePath: true },
  { id: "L6", source: "ACC-5512", target: "ACC-7721", amount: 180000, txCount: 12, timestamp: "2 mins ago", isSuspicious: true },
  { id: "L7", source: "ACC-4402", target: "ACC-8812", amount: 120000, txCount: 15, timestamp: "1 min ago", isSuspicious: true },
  { id: "L8", source: "ACC-6610", target: "ACC-8921", amount: 5000, txCount: 1, timestamp: "1 hour ago", isSuspicious: false },
];

export const MuleNetworkGraphView: React.FC<MuleNetworkGraphViewProps> = ({ transactions = [] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [nodes, setNodes] = useState<NodeData[]>(INITIAL_NODES);
  const [links, setLinks] = useState<LinkData[]>(INITIAL_LINKS);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(INITIAL_NODES[3]);
  const [filterType, setFilterType] = useState<string>("All");
  const [showCyclesOnly, setShowCyclesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [frozenNodes, setFrozenNodes] = useState<string[]>(["ACC-3304"]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    // Build dynamic nodes and links from passed transactions
    const nodeMap = new Map<string, NodeData>();
    INITIAL_NODES.forEach((n) => nodeMap.set(n.id, { ...n }));

    const linkList: LinkData[] = [...INITIAL_LINKS];

    transactions.forEach((tx, idx) => {
      const sourceId = tx.accountNumber;
      let targetId = tx.destination;

      // Ensure source node exists
      if (!nodeMap.has(sourceId)) {
        nodeMap.set(sourceId, {
          id: sourceId,
          name: tx.customerName || `Account ${sourceId}`,
          type: tx.riskScore > 80 ? "Mule Account" : "Primary",
          riskScore: tx.riskScore,
          balance: 50000,
          flagged: tx.riskScore > 70,
          totalInflow: tx.type === "Deposit" ? tx.amount : 0,
          totalOutflow: tx.type !== "Deposit" ? tx.amount : 0,
        });
      } else {
        const existing = nodeMap.get(sourceId)!;
        existing.riskScore = Math.max(existing.riskScore, tx.riskScore);
        if (tx.type !== "Deposit") existing.totalOutflow += tx.amount;
        else existing.totalInflow += tx.amount;
      }

      // Format target ID if needed
      if (!targetId.startsWith("ACC-")) {
        if (targetId.toLowerCase().includes("crypto") || targetId.toLowerCase().includes("binance")) {
          targetId = "ACC-7721";
        } else if (targetId.toLowerCase().includes("atm")) {
          targetId = "ACC-8812";
        } else if (targetId.toLowerCase().includes("shell") || targetId.toLowerCase().includes("corp")) {
          targetId = "ACC-5512";
        }
      }

      if (!nodeMap.has(targetId)) {
        nodeMap.set(targetId, {
          id: targetId,
          name: targetId,
          type: targetId.includes("7721") ? "Crypto Exchange" : targetId.includes("8812") ? "ATM Cashout" : "Mule Account",
          riskScore: tx.riskScore,
          balance: 10000,
          flagged: tx.riskScore > 70,
          totalInflow: tx.amount,
          totalOutflow: 0,
        });
      }

      // Avoid duplicate exact link IDs
      const linkId = `TX-LINK-${tx.id || idx}`;
      if (!linkList.some((l) => l.id === linkId)) {
        linkList.push({
          id: linkId,
          source: sourceId,
          target: targetId,
          amount: tx.amount,
          txCount: 1,
          timestamp: tx.timestamp,
          isSuspicious: tx.riskScore > 70,
          isCyclePath: tx.riskScore > 85,
        });
      }
    });

    setNodes(Array.from(nodeMap.values()));
    setLinks(linkList);
  }, [transactions]);

  // Render D3 Interactive Force Directed Graph
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;

    // Clear previous elements
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");

    // Filter nodes and links based on UI state
    let filteredNodes = nodes.filter((n) => {
      if (filterType !== "All" && n.type !== filterType) return false;
      if (showCyclesOnly && !n.isCycleMember) return false;
      if (searchQuery && !n.name.toLowerCase().includes(searchQuery.toLowerCase()) && !n.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    const activeNodeIds = new Set(filteredNodes.map((n) => n.id));

    let filteredLinks = links.filter((l) => {
      const sourceId = typeof l.source === "object" ? (l.source as NodeData).id : l.source;
      const targetId = typeof l.target === "object" ? (l.target as NodeData).id : l.target;
      if (showCyclesOnly && !l.isCyclePath) return false;
      return activeNodeIds.has(sourceId) && activeNodeIds.has(targetId);
    });

    // Deep clone data for D3 mutation
    const nodesCopy: NodeData[] = JSON.parse(JSON.stringify(filteredNodes));
    const linksCopy: LinkData[] = JSON.parse(JSON.stringify(filteredLinks));

    // D3 Simulation Setup
    const simulation = d3
      .forceSimulation<NodeData>(nodesCopy)
      .force(
        "link",
        d3
          .forceLink<NodeData, LinkData>(linksCopy)
          .id((d) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(35));

    // Arrow markers for links
    svg
      .append("defs")
      .selectAll("marker")
      .data(["normal", "suspicious", "cycle"])
      .enter()
      .append("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", (d) => (d === "cycle" ? "#f43f5e" : d === "suspicious" ? "#fbbf24" : "#64748b"));

    // Container for zoom/pan
    const container = svg.append("g");

    // Add Zoom Behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
      container.attr("transform", event.transform);
    });
    svg.call(zoom as any);

    // Draw Links
    const linkG = container
      .append("g")
      .selectAll("line")
      .data(linksCopy)
      .enter()
      .append("line")
      .attr("stroke", (d) => (d.isCyclePath ? "#f43f5e" : d.isSuspicious ? "#fbbf24" : "#334155"))
      .attr("stroke-width", (d) => (d.isCyclePath ? 3 : d.isSuspicious ? 2 : 1.5))
      .attr("stroke-dasharray", (d) => (d.isCyclePath ? "6,3" : "none"))
      .attr("marker-end", (d) =>
        d.isCyclePath ? "url(#arrow-cycle)" : d.isSuspicious ? "url(#arrow-suspicious)" : "url(#arrow-normal)"
      );

    // Draw Link Labels (Amounts)
    const linkLabels = container
      .append("g")
      .selectAll("text")
      .data(linksCopy)
      .enter()
      .append("text")
      .text((d) => `₹${(d.amount / 1000).toFixed(0)}k`)
      .attr("font-size", "9px")
      .attr("fill", "#94a3b8")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold");

    // Draw Node Groups
    const nodeG = container
      .append("g")
      .selectAll("g")
      .data(nodesCopy)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d);
      })
      .call(
        d3
          .drag<SVGGElement, NodeData>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any
      );

    // Node Outer Pulse Ring for High Risk / Mule
    nodeG
      .filter((d) => d.riskScore >= 75)
      .append("circle")
      .attr("r", 24)
      .attr("fill", "none")
      .attr("stroke", (d) => (d.isCycleMember ? "#f43f5e" : "#eab308"))
      .attr("stroke-width", 2)
      .attr("opacity", 0.6)
      .append("animate")
      .attr("attributeName", "r")
      .attr("values", "20;28;20")
      .attr("dur", "2s")
      .attr("repeatCount", "indefinite");

    // Node Main Circle
    nodeG
      .append("circle")
      .attr("r", 18)
      .attr("fill", (d) => {
        if (frozenNodes.includes(d.id)) return "#1e293b";
        if (d.type === "Mule Account") return "#7f1d1d";
        if (d.type === "Shell Company") return "#831843";
        if (d.type === "Crypto Exchange") return "#581c87";
        if (d.type === "ATM Cashout") return "#78350f";
        return "#0f172a";
      })
      .attr("stroke", (d) => {
        if (frozenNodes.includes(d.id)) return "#38bdf8";
        if (d.riskScore >= 80) return "#ef4444";
        if (d.riskScore >= 50) return "#f59e0b";
        return "#10b981";
      })
      .attr("stroke-width", 2.5);

    // Node Center Icon Text
    nodeG
      .append("text")
      .text((d) => {
        if (frozenNodes.includes(d.id)) return "❄️";
        if (d.type === "Mule Account") return "⚠️";
        if (d.type === "Shell Company") return "🏢";
        if (d.type === "Crypto Exchange") return "₿";
        if (d.type === "ATM Cashout") return "🏧";
        return "👤";
      })
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "12px");

    // Node Label (Name & ID)
    nodeG
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 32)
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("fill", "#f8fafc");

    // Node Subtext (Type & Risk)
    nodeG
      .append("text")
      .text((d) => `${d.id} • Risk ${d.riskScore}%`)
      .attr("text-anchor", "middle")
      .attr("dy", 43)
      .attr("font-size", "8px")
      .attr("fill", (d) => (d.riskScore >= 80 ? "#fca5a5" : "#94a3b8"));

    // Simulation Tick Updates
    simulation.on("tick", () => {
      linkG
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkLabels
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2 - 4);

      nodeG.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, filterType, showCyclesOnly, searchQuery, frozenNodes]);

  const toggleFreezeNode = (id: string) => {
    if (frozenNodes.includes(id)) {
      setFrozenNodes(frozenNodes.filter((n) => n !== id));
    } else {
      setFrozenNodes([...frozenNodes, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Network className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              Module 1.1 • Graph AI Engine
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Mule Account & Money Laundering Network Graph
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Interactive D3.js force-directed topology map. Real-time detection of circular transfer loops (Account A → B → C → A), shell company rapid layering, and crypto offramp cashouts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() =>
              exportToCsv(
                `Mule_Network_Topology_${new Date().toISOString().split("T")[0]}.csv`,
                links.map((link) => ({
                  SourceNode: typeof link.source === "object" ? (link.source as any).id : link.source,
                  TargetNode: typeof link.target === "object" ? (link.target as any).id : link.target,
                  AmountINR: link.amount,
                  LaunderingPattern: link.type,
                  IsCircularLoop: link.isCycle ? "YES" : "NO",
                }))
              )
            }
            className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4 text-sky-400" />
            Export Graph CSV
          </button>
          <button
            onClick={() => setShowCyclesOnly(!showCyclesOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              showCyclesOnly
                ? "bg-rose-500 text-slate-950 border-rose-400"
                : "bg-slate-900 text-rose-400 border-rose-500/30 hover:bg-slate-800"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {showCyclesOnly ? "Showing Laundering Cycles" : "Highlight Circular Loops"}
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search account ID, customer or shell entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-slate-100 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-2">
          <span className="text-slate-400 font-medium shrink-0">Node Filter:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl py-2 px-3 focus:outline-none font-medium"
          >
            <option value="All">All Entities (Primary, Mules, Shells, Crypto)</option>
            <option value="Primary">Primary Customers Only</option>
            <option value="Mule Account">Flagged Mule Accounts</option>
            <option value="Shell Company">Shell Entities</option>
            <option value="Crypto Exchange">Crypto Offramps</option>
            <option value="ATM Cashout">ATM Rapid Outflows</option>
          </select>
        </div>

        <div className="md:col-span-4 flex items-center justify-end gap-3 font-mono text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Suspicious
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> Mule / Cycle
          </span>
        </div>
      </div>

      {/* Main Visualizer Area & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 relative min-h-[500px] flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono z-10">
            <div className="flex items-center gap-2">
              <CircleDot className="w-4 h-4 text-rose-400 animate-spin" />
              <span>Topology Engine: D3 Force Directed Network</span>
            </div>
            <span>Scroll to Zoom • Drag Nodes</span>
          </div>

          <svg ref={svgRef} className="w-full h-[450px] my-auto cursor-grab active:cursor-grabbing"></svg>

          {/* Laundering Loop Alert Banner */}
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-2.5 text-rose-200 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Circular Ring Detected:</strong> ACC-3304 ➔ ACC-4402 ➔ ACC-5512 ➔ ACC-3304 (Velocity: ₹4,80,000 transferred in 25 mins)
              </span>
            </div>
            <button
              onClick={() => {
                setFrozenNodes(["ACC-3304", "ACC-4402", "ACC-5512"]);
              }}
              className="px-3 py-1 bg-rose-500 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-rose-400 shrink-0"
            >
              Freeze Entire Ring
            </button>
          </div>
        </div>

        {/* Selected Node Details Panel */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                Selected Node Analysis
              </span>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                {selectedNode ? selectedNode.name : "Select a Node"}
              </h3>
            </div>
            {selectedNode && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  selectedNode.riskScore >= 80
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : selectedNode.riskScore >= 50
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                Risk Score: {selectedNode.riskScore}%
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono block">Account ID</span>
                  <span className="font-bold text-slate-100 font-mono">{selectedNode.id}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono block">Entity Type</span>
                  <span className="font-bold text-sky-400">{selectedNode.type}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono block">Total Inflow</span>
                  <span className="font-bold text-emerald-400">₹{selectedNode.totalInflow.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono block">Total Outflow</span>
                  <span className="font-bold text-rose-400">₹{selectedNode.totalOutflow.toLocaleString()}</span>
                </div>
              </div>

              {selectedNode.isCycleMember && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Circular Money Laundering Cycle Member
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    This account acts as a rapid passthrough node in a 3-way circular transfer topology designed to obfuscate audit trails.
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 text-xs block">Automated AI Risk Directives</span>
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Cross-border SWIFT / IMPS velocity score exceeds 92/100 threshold.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Dormant account activated with high-value rapid layering within 15 minutes.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => toggleFreezeNode(selectedNode.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    frozenNodes.includes(selectedNode.id)
                      ? "bg-slate-800 text-sky-400 border border-sky-500/30"
                      : "bg-rose-500 hover:bg-rose-400 text-slate-950"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  {frozenNodes.includes(selectedNode.id) ? "Account Frozen (Click to Unfreeze)" : "Freeze Account & Block Transfers"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Click on any node in the topology map to inspect financial flows and execute countermeasure directives.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
