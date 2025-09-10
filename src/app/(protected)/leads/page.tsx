"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/store/uiStore";
import LeadDetail from "@/components/LeadDetails";

export default function LeadsPage() {
  const { setSelectedLead } = useUIStore();

  // State for search and filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Query with search/filter params
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads", search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter && statusFilter !== "All") params.set("status", statusFilter);
      const res = await fetch(`/api/leads?${params.toString()}`);
      return res.json();
    },
  });

  // Badge for status
  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      Pending: "bg-indigo-100 text-indigo-700 border-indigo-200",
      "Pending Approval": "bg-purple-100 text-purple-700 border-purple-200",
      Contacted: "bg-blue-100 text-blue-700 border-blue-200",
      Responded: "bg-green-100 text-green-700 border-green-200",
      Converted: "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Do Not Contact": "bg-gray-100 text-gray-700 border-gray-200",
    };
    const defaultStyle = "bg-gray-100 text-gray-700 border-gray-200";
    const style = statusStyles[status] || defaultStyle;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${style}`}>
        <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
        {status}
      </span>
    );
  };

  // Dummy activity bars visual (replace with a progress metric if available)
  const getActivityBars = () => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className="w-1 h-6 bg-yellow-400 rounded-sm"
        ></div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
      </div>

      {/* Search/Filter */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search name/email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-60"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Contacted">Contacted</option>
          <option value="Responded">Responded</option>
          <option value="Converted">Converted</option>
          <option value="Do Not Contact">Do Not Contact</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div><span className="text-sm font-medium text-gray-700">Name</span></div>
          <div><span className="text-sm font-medium text-gray-700">Campaign Name</span></div>
          <div><span className="text-sm font-medium text-gray-700">Activity</span></div>
          <div><span className="text-sm font-medium text-gray-700">Status</span></div>
          <div><span className="text-sm font-medium text-gray-700">Last Contact Date</span></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {leads.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No leads found.
            </div>
          )}

          {leads.map((lead: any) => (
            <div
              key={lead.id}
              className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedLead(lead)}
            >
              {/* Name/Email */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {lead.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  <div className="text-sm text-gray-500">{lead.email}</div>
                </div>
              </div>
              {/* Campaign Name */}
              <div className="flex items-center">
                <div className="text-sm text-gray-900">
                  {lead.campaignName || lead.campaign_id || "No Campaign"}
                </div>
              </div>
              {/* Activity */}
              <div className="flex items-center">
                {getActivityBars()}
              </div>
              {/* Status */}
              <div className="flex items-center">
                {getStatusBadge(lead.status)}
              </div>
              {/* Last Contact Date */}
              <div className="flex items-center">
                {lead.lastContactDate
                  ? new Date(lead.lastContactDate).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail Side Sheet */}
      <LeadDetail />
    </div>
  );
}
