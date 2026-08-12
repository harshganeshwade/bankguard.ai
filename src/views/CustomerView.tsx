import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Snowflake,
  Play,
  FileText,
  Upload,
  Edit2,
  Trash2,
  X,
  CreditCard,
  IndianRupee,
  Activity,
  User,
  CheckCircle,
  Download,
} from "lucide-react";
import { Customer, KYCStatus, CustomerType } from "../types";
import { exportToCsv } from "../utils/downloadReport";

interface CustomerViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKYC, setFilterKYC] = useState<string>("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // New Customer Form State
  const [formData, setFormData] = useState({
    name: "",
    aadhaar: "",
    pan: "",
    address: "",
    email: "",
    mobile: "",
    dob: "",
    occupation: "",
    annualIncome: 75000,
    customerType: "Individual" as CustomerType,
    kycStatus: "Verified" as KYCStatus,
  });

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.aadhaar.includes(searchQuery) ||
      c.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKYC = filterKYC === "All" || c.kycStatus === filterKYC;
    return matchesSearch && matchesKYC;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newCust: Customer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      aadhaar: formData.aadhaar || "9900-1122-3344",
      pan: formData.pan || "ABCDE1234F",
      address: formData.address || "100 Banking Plaza, City Center",
      email: formData.email,
      mobile: formData.mobile || "+1 (555) 000-1122",
      dob: formData.dob || "1990-01-01",
      occupation: formData.occupation || "Professional",
      annualIncome: Number(formData.annualIncome),
      customerType: formData.customerType,
      kycStatus: formData.kycStatus,
      creditScore: Math.floor(650 + Math.random() * 180),
      riskScore: Math.floor(10 + Math.random() * 40),
      isFrozen: false,
      linkedAccountsCount: 1,
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      documents: [
        {
          name: "Aadhaar_Document.pdf",
          type: "Identity",
          date: new Date().toISOString().split("T")[0],
          status: "Verified",
        },
      ],
    };

    onAddCustomer(newCust);
    setShowAddModal(false);
    setFormData({
      name: "",
      aadhaar: "",
      pan: "",
      address: "",
      email: "",
      mobile: "",
      dob: "",
      occupation: "",
      annualIncome: 75000,
      customerType: "Individual",
      kycStatus: "Verified",
    });
  };

  const toggleFreeze = (cust: Customer) => {
    onUpdateCustomer({
      ...cust,
      isFrozen: !cust.isFrozen,
      riskScore: !cust.isFrozen ? 95 : 20,
    });
    if (selectedCustomer?.id === cust.id) {
      setSelectedCustomer({
        ...selectedCustomer,
        isFrozen: !cust.isFrozen,
        riskScore: !cust.isFrozen ? 95 : 20,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#bec6e0] font-headline-md">
            Customer Management
          </h1>
          <p className="text-sm text-[#c6c6cd] mt-1">
            Monitor client profiles, KYC verification status, and risk assessments.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() =>
              exportToCsv(
                `Customer_Directory_${new Date().toISOString().split("T")[0]}.csv`,
                customers.map((c) => ({
                  ID: c.id,
                  Name: c.name,
                  Email: c.email,
                  Mobile: c.mobile,
                  Aadhaar: c.aadhaar,
                  PAN: c.pan,
                  KYCStatus: c.kycStatus,
                  CreditScore: c.creditScore,
                  RiskScore: c.riskScore,
                  AnnualIncome: `INR ${c.annualIncome}`,
                  Frozen: c.isFrozen ? "Yes" : "No",
                }))
              )
            }
            className="bg-[#1E293B] border border-[#334155] text-[#d4e4fa] text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#334155] transition-colors shadow-md"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" />
            <span>Export Directory (CSV)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#38BDF8] text-[#051424] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Customer</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c6c6cd]" />
          <input
            type="text"
            placeholder="Search by name, Aadhaar, PAN, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 pl-10 pr-4 text-xs text-[#d4e4fa] placeholder-[#909097] focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterKYC}
            onChange={(e) => setFilterKYC(e.target.value)}
            className="bg-[#0F172A] border border-[#334155] text-xs text-[#d4e4fa] rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="All">All KYC Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Roster Container */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-[#334155] bg-[#0F172A] flex justify-between items-center">
          <span className="text-xs font-bold text-[#c6c6cd] uppercase tracking-wider">
            Client Directory ({filteredCustomers.length})
          </span>
        </div>

        <div className="divide-y divide-[#334155]">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="p-4 hover:bg-[#334155]/60 transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-center"
            >
              <div className="md:col-span-4 flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center font-bold text-[#38BDF8] text-sm border border-[#334155] shrink-0 overflow-hidden">
                  {cust.avatarUrl ? (
                    <img
                      src={cust.avatarUrl}
                      alt={cust.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (cust.name || "CU").slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#d4e4fa]">
                    {cust.name} {cust.isFrozen && <span className="text-[#EF4444] text-xs font-bold">(FROZEN)</span>}
                  </div>
                  <div className="text-xs text-[#c6c6cd]">
                    PAN: {cust.pan} | {cust.customerType}
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 text-xs text-[#c6c6cd] w-full">
                <div>Aadhaar: <span className="font-mono text-[#d4e4fa]">{cust.aadhaar}</span></div>
                <div>{cust.email}</div>
              </div>

              <div className="md:col-span-2 flex items-center gap-2 w-full">
                <span
                  className={`px-2 py-1 rounded text-[11px] font-bold border ${
                    cust.kycStatus === "Verified"
                      ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                      : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                  }`}
                >
                  KYC: {cust.kycStatus}
                </span>

                <span
                  className={`px-2 py-1 rounded text-[11px] font-bold border ${
                    cust.riskScore >= 75
                      ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
                      : cust.riskScore >= 40
                      ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                      : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                  }`}
                >
                  Risk {cust.riskScore}%
                </span>
              </div>

              <div className="md:col-span-3 flex items-center justify-end gap-2 w-full">
                <button
                  onClick={() => toggleFreeze(cust)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    cust.isFrozen
                      ? "bg-[#10B981] text-[#051424] hover:opacity-90"
                      : "bg-[#EF4444] text-white hover:bg-red-600"
                  }`}
                >
                  {cust.isFrozen ? "Activate" : "Freeze"}
                </button>

                <button
                  onClick={() => setSelectedCustomer(cust)}
                  className="px-3 py-1.5 bg-[#0F172A] border border-[#334155] text-[#d4e4fa] rounded text-xs font-medium hover:bg-[#334155] transition-colors"
                >
                  Full Profile
                </button>

                <button
                  onClick={() => onDeleteCustomer(cust.id)}
                  className="p-1.5 text-[#909097] hover:text-[#EF4444] transition-colors"
                  title="Delete Customer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Profile Detailed Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative text-[#d4e4fa]">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-[#c6c6cd] hover:text-white p-1 rounded-lg bg-[#0F172A]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b border-[#334155] pb-4">
              <div className="w-16 h-16 rounded-full bg-[#0F172A] border-2 border-[#38BDF8] overflow-hidden shrink-0">
                <img
                  src={selectedCustomer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                  alt={selectedCustomer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#bec6e0]">
                  {selectedCustomer.name}
                </h2>
                <div className="text-xs text-[#c6c6cd] mt-0.5">
                  Customer ID: {selectedCustomer.id} | Type: {selectedCustomer.customerType}
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 text-[10px] font-bold rounded">
                    Credit Score: {selectedCustomer.creditScore}
                  </span>
                  <span className="px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 text-[10px] font-bold rounded">
                    Risk Score: {selectedCustomer.riskScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                <div className="text-[#909097] font-semibold mb-1">Aadhaar Number</div>
                <div className="font-mono text-sm">{selectedCustomer.aadhaar}</div>
              </div>

              <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                <div className="text-[#909097] font-semibold mb-1">PAN Number</div>
                <div className="font-mono text-sm">{selectedCustomer.pan}</div>
              </div>

              <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                <div className="text-[#909097] font-semibold mb-1">Email & Phone</div>
                <div>{selectedCustomer.email}</div>
                <div className="text-[#c6c6cd]">{selectedCustomer.mobile}</div>
              </div>

              <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                <div className="text-[#909097] font-semibold mb-1">Occupation & Income</div>
                <div>{selectedCustomer.occupation}</div>
                <div className="text-[#10B981] font-bold">₹{selectedCustomer.annualIncome.toLocaleString()} / year</div>
              </div>

              <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155] md:col-span-2">
                <div className="text-[#909097] font-semibold mb-1">Residential Address</div>
                <div>{selectedCustomer.address}</div>
              </div>
            </div>

            {/* KYC Documents */}
            <div>
              <h3 className="text-xs font-bold text-[#c6c6cd] uppercase mb-2">
                KYC Verification Documents
              </h3>
              <div className="space-y-2">
                {selectedCustomer.documents?.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0F172A] p-3 rounded-lg border border-[#334155] text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#38BDF8]" />
                      <span>{doc.name}</span>
                    </div>
                    <span className="text-[#10B981] font-bold">{doc.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#334155]">
              <button
                onClick={() => toggleFreeze(selectedCustomer)}
                className={`px-4 py-2 rounded text-xs font-bold ${
                  selectedCustomer.isFrozen
                    ? "bg-[#10B981] text-[#051424]"
                    : "bg-[#EF4444] text-white"
                }`}
              >
                {selectedCustomer.isFrozen ? "Unfreeze Account" : "Freeze Customer Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCustomer}
            className="bg-[#1E293B] border border-[#334155] rounded-xl max-w-xl w-full p-6 space-y-4 text-xs text-[#d4e4fa]"
          >
            <div className="flex justify-between items-center border-b border-[#334155] pb-3">
              <h2 className="text-base font-bold text-[#bec6e0]">
                Onboard New Bank Customer
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#c6c6cd]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#909097] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#909097] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#909097] mb-1">Aadhaar No.</label>
                <input
                  type="text"
                  placeholder="8492-1102-9921"
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#909097] mb-1">PAN Card No.</label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#909097] mb-1">Mobile No.</label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#909097] mb-1">Customer Type</label>
                <select
                  value={formData.customerType}
                  onChange={(e) => setFormData({ ...formData, customerType: e.target.value as CustomerType })}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded p-2 text-xs"
                >
                  <option value="Individual">Individual</option>
                  <option value="Corporate">Corporate</option>
                  <option value="HNWI">HNWI</option>
                  <option value="NRI">NRI</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#909097] mb-1">Residential Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#334155] rounded p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#334155]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 bg-[#0F172A] border border-[#334155] rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#38BDF8] text-[#051424] font-bold rounded"
              >
                Submit Customer Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
