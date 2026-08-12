import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import {
  Network,
  AlertTriangle,
  Download,
  Lock,
  Search,
  RefreshCw,
  ShieldAlert,
  Zap,
  Filter,
  ArrowRight,
  Eye,
  CheckCircle2,
  XCircle,
  Building2,
  CreditCard,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Transaction } from "../types";
import { exportToCsv, downloadFile } from "../utils/downloadReport";

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

const DEFAULT_NODES: NodeData[] = [
  { id: "ACC-8921", name: "Vikramaditya Rao", type: "Primary", riskScore: 12, balance: 142850, flagged: false, totalInflow: 250000, totalOutflow: 107150 },
  { id: "ACC-9921", name: "Dr. Rajesh Mehta", type: "Primary", riskScore: 18, balance: 38200, flagged: false, totalInflow: 85000, totalOutflow: 46800 },
  { id: "ACC-1102", name: "Harsh Ganeshwade", type: "Primary", riskScore: 8, balance: 512900, flagged: false, totalInflow: 600000, totalOutflow: 87100 },
  { id: "ACC-3304", name: "Mule Node Alpha (Shell)", type: "Mule Account", riskScore: 94, balance: 1200, flagged: true, totalInflow: 480000, totalOutflow: 478800, isCycleMember: true },
  { id: "ACC-4402", name: "Mule Node Beta (Fast Layer)", type: "Mule Account", riskScore: 91, balance: 800, flagged: true, totalInflow: 478800, totalOutflow: 478000, isCycleMember: true },
  { id: "ACC-5512", name: "Global Offshore Corp", type: "Shell Company", riskScore: 88, balance: 4500, flagged: true, totalInflow: 478000, totalOutflow: 473500, isCycleMember: true },
  { id: "ACC-7721", name: "Crypto Offramp Alpha", type: "Crypto Exchange", riskScore: 96, balance: 950000, flagged: true, totalInflow: 1200000, totalOutflow: 250000 },
  { id: "ACC-8812", name: "ATM Terminal Node #104", type: "ATM Cashout", riskScore: 92, balance: 0, flagged: true, totalInflow: 320000, totalOutflow: 320000 },
  { id: "ACC-9041", name: "Priya Sharma", type: "Primary", riskScore: 25, balance: 89000, flagged: false, totalInflow: 120000, totalOutflow: 31000 },
  { id: "ACC-6109", name: "Front Trading Logistics", type: "Shell Company", riskScore: 85, balance: 12400, flagged: true, totalInflow: 310000, totalOutflow: 297600 },
];

const DEFAULT_LINKS: LinkData[] = [
  { id: "L1", source: "ACC-8921", target: "ACC-9921", amount: 15000, txCount: 2, timestamp: "10 mins ago", isSuspicious: false },
  { id: "L2", source: "ACC-1102", target: "ACC-3304", amount: 250000, txCount: 5, timestamp: "25 mins ago", isSuspicious: true },
  { id: "L3", source: "ACC-3304", target: "ACC-4402", amount: 245000, txCount: 8, timestamp: "20 mins ago", isSuspicious: true, isCyclePath: true },
  { id: "L4", source: "ACC-4402", target: "ACC-5512", amount: 240000, txCount: 6, timestamp: "15 mins ago", isSuspicious: true, isCyclePath: true },
  { id: "L5", source: "ACC-5512", target: "ACC-3304", amount: 235000, txCount: 4, timestamp: "5 mins ago", isSuspicious: true, isCyclePath: true },
  { id: "L6", source: "ACC-5512", target: "ACC-7721", amount: 450000, txCount: 3, timestamp: "30 mins ago", isSuspicious: true },
  { id: "L7", source: "ACC-4402", target: "ACC-8812", amount: 180000, txCount: 12, timestamp: "2 mins ago", isSuspicious: true },
  { id: "L8", source: "ACC-9041", target: "ACC-6109", amount: 75000, txCount: 2, timestamp: "1 hr ago", isSuspicious: false },
  { id: "L9", source: "ACC-6109", target: "ACC-7721", amount: 290000, txCount: 4, timestamp: "45 mins ago", isSuspicious: true },
];

export const MuleNetworkGraphView: React.FC<MuleNetworkGraphViewProps> = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [minRiskScore, setMinRiskScore] = useState(0);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [highlightCycles, setHighlightCycles] = useState(true);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(DEFAULT_NODES[3]);
  const [nodes, setNodes] = useState<NodeData[]>(DEFAULT_NODES);
  const [links] = useState<LinkData[]>(DEFAULT_LINKS);
  const [frozenNodeIds, setFrozenNodeIds] = useState<string[]>([]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const matchesSearch =
        !searchQuery ||
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = n.riskScore >= minRiskScore;
      const matchesType = selectedType === "ALL" || n.type === selectedType;
      return matchesSearch && matchesRisk && matchesType;
    });
  }, [nodes, searchQuery, minRiskScore, selectedType]);

  const filteredNodeIds = useMemo(
    () => new Set(filteredNodes.map((n) => n.id)),
    [filteredNodes]
  );

  const filteredLinks = useMemo(() => {
    return links.filter((l) => {
      const sId = typeof l.source === "object" ? (l.source as any).id : l.source;
      const tId = typeof l.target === "object" ? (l.target as any).id : l.target;
      return filteredNodeIds.has(sId) && filteredNodeIds.has(tId);
    });
  }, [links, filteredNodeIds]);

  // Main D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 900;
    const height = 520;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");

    // Definitions for markers/gradients
    const defs = svg.append("defs");

    // Arrow marker standard
    defs
      .append("marker")
      .attr("id", "arrow-std")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#64748b");

    // Arrow marker suspicious / cycle
    defs
      .append("marker")
      .attr("id", "arrow-danger")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26)
      .attr("refY", 0)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#ef4444");

    const container = svg.append("g");

    // Zoom setup
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    const nodesCopy: NodeData[] = JSON.parse(JSON.stringify(filteredNodes));
    const linksCopy: LinkData[] = JSON.parse(JSON.stringify(filteredLinks));

    const simulation = d3
      .forceSimulation<NodeData>(nodesCopy)
      .force(
        "link",
        d3
          .forceLink<NodeData, LinkData>(linksCopy)
          .id((d) => d.id)
          .distance(140)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Draw Links
    const linkG = container
      .append("g")
      .selectAll("line")
      .data(linksCopy)
      .enter()
      .append("line")
      .attr("stroke", (d) =>
        highlightCycles && d.isCyclePath
          ? "#ef4444"
          : d.isSuspicious
          ? "#f59e0b"
          : "#334155"
      )
      .attr("stroke-dasharray", (d) => (d.isSuspicious ? "5,5" : "none"))
      .attr("stroke-width", (d) => (d.amount > 200000 ? 3 : 1.8))
      .attr("marker-end", (d) =>
        d.isSuspicious || d.isCyclePath ? "url(#arrow-danger)" : "url(#arrow-std)"
      );

    // Flow labels on links
    const linkLabels = container
      .append("g")
      .selectAll("text")
      .data(linksCopy)
      .enter()
      .append("text")
      .text((d) => `₹${(d.amount / 1000).toFixed(0)}k`)
      .attr("font-size", "9px")
      .attr("font-family", "monospace")
      .attr("fill", (d) => (d.isCyclePath ? "#fca5a5" : "#94a3b8"))
      .attr("text-anchor", "middle");

    // Draw Nodes
    const nodeG = container
      .append("g")
      .selectAll("g")
      .data(nodesCopy)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
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

    // Outer aura ring for cycle or high risk nodes
    nodeG
      .filter((d) => d.riskScore >= 80 || (highlightCycles && !!d.isCycleMember))
      .append("circle")
      .attr("r", 24)
      .attr("fill", "none")
      .attr("stroke", (d) => (d.isCycleMember ? "#ef4444" : "#f59e0b"))
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0.8);

    // Main Node Circle
    nodeG
      .append("circle")
      .attr("r", 18)
      .attr("fill", (d) => {
        if (frozenNodeIds.includes(d.id)) return "#1e293b";
        if (d.type === "Mule Account") return "#3f1d1d";
        if (d.type === "Shell Company") return "#2e1065";
        if (d.type === "Crypto Exchange") return "#1e1b4b";
        if (d.type === "ATM Cashout") return "#450a0a";
        return "#0f172a";
      })
      .attr("stroke", (d) => {
        if (frozenNodeIds.includes(d.id)) return "#64748b";
        if (d.riskScore >= 80) return "#ef4444";
        if (d.riskScore >= 50) return "#f59e0b";
        return "#10b981";
      })
      .attr("stroke-width", 2.5);

    // Node Type Icon / Text
    nodeG
      .append("text")
      .text((d) => (d.type === "Primary" ? "P" : d.type === "Mule Account" ? "M" : d.type === "Shell Company" ? "S" : d.type === "Crypto Exchange" ? "C" : "ATM"))
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("font-family", "monospace")
      .attr("fill", "#ffffff");

    // Node Label
    nodeG
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 32)
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("fill", "#e2e8f0");

    // Node Risk Badge Label
    nodeG
      .append("text")
      .text((d) => `${d.riskScore}% RISK`)
      .attr("text-anchor", "middle")
      .attr("dy", 44)
      .attr("font-size", "8px")
      .attr("font-family", "monospace")
      .attr("font-weight", "bold")
      .attr("fill", (d) => (d.riskScore >= 80 ? "#f87171" : "#34d399"));

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
  }, [filteredNodes, filteredLinks, highlightCycles, frozenNodeIds]);

  const handleToggleFreezeNode = (id: string) => {
    setFrozenNodeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportGraphData = () => {
    const exportData = nodes.map((n) => ({
      AccountID: n.id,
      AccountName: n.name,
      NodeType: n.type,
      RiskScore: n.riskScore,
      Flagged: n.flagged,
      Balance: n.balance,
      TotalInflow: n.totalInflow,
      TotalOutflow: n.totalOutflow,
    }));
    exportToCsv("Mule_Network_Topology.csv", exportData);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-100">
      {/* View Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Network className="w-7 h-7 text-sky-400" />
            Money Flow & Mule Network Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time topology graphing, circular transfer loop detection, and shell entity layering visualization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportGraphData}
            className="px-3.5 py-1.5 rounded-lg bg-[#0F141D] border border-[#202938] hover:bg-[#151B26] text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export Topology CSV</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
          <div className="text-[11px] text-slate-400 font-sans">Tracked Network Nodes</div>
          <div className="text-2xl font-bold text-white mt-1">{nodes.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Active graph entities</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
          <div className="text-[11px] text-slate-400 font-sans">Circular Transfers</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">1 DETECTED</div>
          <div className="text-[10px] text-slate-500 mt-1">Loop: Node Alpha → Beta → Shell</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
          <div className="text-[11px] text-slate-400 font-sans">Layered Capital Flow</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">₹4.85M</div>
          <div className="text-[10px] text-slate-500 mt-1">High velocity passthrough</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
          <div className="text-[11px] text-slate-400 font-sans">Frozen Nodes</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">
            {frozenNodeIds.length} / {nodes.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Active hold interventions</div>
        </div>
      </div>

      {/* Control Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Node */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search account name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#080B12] border border-[#202938] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-56 font-mono"
            />
          </div>

          {/* Node Type Selector */}
          <div className="flex items-center gap-1 bg-[#080B12] p-1 rounded-lg border border-[#202938]">
            {["ALL", "Mule Account", "Shell Company", "Crypto Exchange", "Primary"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    selectedType === type
                      ? "bg-sky-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {type === "Mule Account"
                    ? "Mules"
                    : type === "Shell Company"
                    ? "Shells"
                    : type === "Crypto Exchange"
                    ? "Crypto"
                    : type}
                </button>
              )
            )}
          </div>

          {/* Min Risk Slider */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#202938]">
            <span className="text-xs text-slate-400 font-mono">Min Risk:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minRiskScore}
              onChange={(e) => setMinRiskScore(Number(e.target.value))}
              className="w-24 accent-sky-400 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-sky-400">
              {minRiskScore}%
            </span>
          </div>
        </div>

        {/* Circular Loop Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={highlightCycles}
              onChange={(e) => setHighlightCycles(e.target.checked)}
              className="rounded accent-rose-500 w-4 h-4 cursor-pointer"
            />
            <span>Highlight Circular Transfer Loops</span>
          </label>
        </div>
      </div>

      {/* Main Canvas & Inspector Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Canvas */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-[#0F141D] border border-[#202938] flex flex-col justify-between relative min-h-[520px]">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2 font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>INTERACTIVE TOPOLOGY CANVAS (Drag nodes, zoom, click to inspect)</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> High Risk / Mule
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Primary
              </span>
            </div>
          </div>

          <div className="w-full flex-1 rounded-lg bg-[#080B12] border border-[#202938] overflow-hidden relative">
            <svg ref={svgRef} className="w-full h-[480px]"></svg>
          </div>
        </div>

        {/* Selected Node Inspector Panel */}
        <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-5 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[#202938] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                    {selectedNode.type}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {selectedNode.name}
                  </h2>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">
                    ID: {selectedNode.id}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded font-mono text-xs font-bold border ${
                    selectedNode.riskScore >= 80
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  {selectedNode.riskScore}% RISK
                </span>
              </div>

              {/* Balances & Volume */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded bg-[#080B12] border border-[#202938]">
                  <div className="text-slate-500 text-[10px]">CURRENT BALANCE</div>
                  <div className="text-base font-bold text-white mt-1">
                    ₹{selectedNode.balance.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded bg-[#080B12] border border-[#202938]">
                  <div className="text-slate-500 text-[10px]">TOTAL INFLOW</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    ₹{(selectedNode.totalInflow / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>

              {/* Status Flags */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-mono text-[10px] uppercase font-bold">
                  Security Diagnostics
                </div>
                <div className="p-3 rounded bg-[#080B12] border border-[#202938] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Circular Transfer Loop:</span>
                    <span
                      className={
                        selectedNode.isCycleMember
                          ? "text-rose-400 font-bold font-mono"
                          : "text-slate-400 font-mono"
                      }
                    >
                      {selectedNode.isCycleMember ? "DETECTED" : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Intervention State:</span>
                    <span
                      className={
                        frozenNodeIds.includes(selectedNode.id)
                          ? "text-amber-400 font-bold font-mono"
                          : "text-emerald-400 font-mono"
                      }
                    >
                      {frozenNodeIds.includes(selectedNode.id)
                        ? "ACCOUNT FROZEN"
                        : "ACTIVE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Connected Links */}
              <div className="space-y-2">
                <div className="text-slate-400 font-mono text-[10px] uppercase font-bold">
                  Direct Topology Transfers
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {links
                    .filter((l) => {
                      const sId = typeof l.source === "object" ? (l.source as any).id : l.source;
                      const tId = typeof l.target === "object" ? (l.target as any).id : l.target;
                      return sId === selectedNode.id || tId === selectedNode.id;
                    })
                    .map((l) => (
                      <div
                        key={l.id}
                        className="p-2 rounded bg-[#080B12] border border-[#202938] flex justify-between items-center text-xs font-mono"
                      >
                        <div className="text-slate-300">
                          {typeof l.source === "object" ? (l.source as any).id : l.source} &rarr;{" "}
                          {typeof l.target === "object" ? (l.target as any).id : l.target}
                        </div>
                        <div className="text-amber-400 font-bold">
                          ₹{l.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Interventions */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => handleToggleFreezeNode(selectedNode.id)}
                  className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                    frozenNodeIds.includes(selectedNode.id)
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                      : "bg-rose-500 hover:bg-rose-400 text-white"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {frozenNodeIds.includes(selectedNode.id)
                      ? "Unfreeze Account Node"
                      : "Freeze Account Node"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
              <Network className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-xs">Click any node on the topology graph to inspect details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
