"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import CampaignModal from "@/components/CampaignModal";
import { useUIStore } from "@/store/uiStore";

// Helper component for summary cards
function SummaryCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="bg-white border shadow rounded p-4 flex flex-col">
      <span className="text-xs text-gray-500 mb-2">{title}</span>
      <span className="font-bold text-2xl">{value}</span>
    </div>
  );
}

// Helper for colored badges
function StatusBadge({ status }: { status: string }) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";
  if (status === "Active") return <span className={`${base} bg-green-100 text-green-700`}>Active</span>;
  if (status === "Draft") return <span className={`${base} bg-gray-100 text-gray-600`}>Draft</span>;
  if (status === "Paused") return <span className={`${base} bg-yellow-100 text-yellow-700`}>Paused</span>;
  if (status === "Completed") return <span className={`${base} bg-blue-100 text-blue-700`}>Completed</span>;
  return <span className={`${base} bg-gray-100 text-gray-500`}>{status}</span>;
}

export default function CampaignsPage() {
  const router = useRouter();
  const { campaignFilter, setCampaignFilter } = useUIStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const queryClient = useQueryClient();

  // Fetch campaigns list
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["campaigns", campaignFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (campaignFilter && campaignFilter !== "All") params.set("status", campaignFilter);
      const res = await fetch(`/api/campaigns?${params}`);
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
  });

  // Row sorting handler
  const sorted = [...campaigns].sort((a, b) => {
    if (sortKey === "name") return a.name.localeCompare(b.name) * (sortDir === "asc" ? 1 : -1);
    if (sortKey === "createdAt") {
      return (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()) * (sortDir === "asc" ? 1 : -1);
    }
    if (sortKey === "status") return a.status.localeCompare(b.status) * (sortDir === "asc" ? 1 : -1);
    if (sortKey === "totalLeads") return (a.totalLeads - b.totalLeads) * (sortDir === "asc" ? 1 : -1);
    if (sortKey === "successfulLeads") return ((a.successfulLeads || 0) - (b.successfulLeads || 0)) * (sortDir === "asc" ? 1 : -1);
    return 0;
  });

  // Example create handler
  async function handleCreateCampaign(data: { name: string; status: string }) {
    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setIsModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
  }

  // Pause/Resume (toggle)
  async function handlePauseResume(campaign: any) {
    const newStatus = campaign.status === "Paused" ? "Active" : "Paused";
    await fetch(`/api/campaigns/${campaign.id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({...campaign, status: newStatus}),
    });
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
  }

  // Calculations for dashboard cards
  const totalLeads = campaigns.reduce((acc, c) => acc + (c.totalLeads || 0), 0);
  const totalSuccess = campaigns.reduce((acc, c) => acc + (c.successfulLeads || 0), 0);
  const avgResponse = campaigns.length ? Math.round((campaigns.reduce((sum, c) =>
    sum + ((c.totalLeads ? (c.successfulLeads || 0) / c.totalLeads : 0)), 0) / campaigns.length) * 100) : 0;

  return (
    <div className="p-6">

      {/* Dashboard summary */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <SummaryCard title="Total Campaigns" value={campaigns.length}/>
        <SummaryCard title="Active Campaigns" value={campaigns.filter(c => c.status === "Active").length}/>
        <SummaryCard title="Total Leads" value={totalLeads}/>
        <SummaryCard title="Avg. Success Rate" value={avgResponse + "%"}/>
      </div>

      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <button
          className="bg-blue-600 text-white rounded px-4 py-2"
          onClick={() => setIsModalOpen(true)}
        >
          + Create Campaign
        </button>
      </header>

      {/* Status filter */}
      <nav className="flex gap-2 mb-6">
        {["All", "Active", "Paused", "Draft", "Completed"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded ${campaignFilter === filter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setCampaignFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </nav>

      {/* Table */}
      <div className="overflow-x-auto rounded border shadow bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 p-4 border-b font-semibold text-sm text-gray-700">
          <div className="cursor-pointer" onClick={() => {
            setSortKey("name");
            setSortDir(sortKey === "name" && sortDir === "asc" ? "desc" : "asc");
          }}>Campaign Name</div>
          <div className="cursor-pointer" onClick={() => {
            setSortKey("status");
            setSortDir(sortKey === "status" && sortDir === "asc" ? "desc" : "asc");
          }}>Status</div>
          <div className="cursor-pointer" onClick={() => {
            setSortKey("totalLeads");
            setSortDir(sortKey === "totalLeads" && sortDir === "asc" ? "desc" : "asc");
          }}>Total Leads</div>
          <div className="cursor-pointer" onClick={() => {
            setSortKey("successfulLeads");
            setSortDir(sortKey === "successfulLeads" && sortDir === "asc" ? "desc" : "asc");
          }}>Successful Leads</div>
          <div>Response Rate (%)</div>
          <div>Progress</div>
          <div>Created Date</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {isLoading ? (
            <div className="text-center p-12 col-span-8">Loading campaigns...</div>
          ) : sorted.length === 0 ? (
            <div className="text-center p-12 text-gray-500 col-span-8">No campaigns found.</div>
          ) : (
            sorted.map((campaign) => {
              const responseRate = campaign.totalLeads
                ? Math.round((campaign.successfulLeads || 0) / campaign.totalLeads * 100)
                : 0;
              return (
                <div
                  key={campaign.id}
                  className="grid grid-cols-8 gap-4 p-4 items-center group hover:bg-gray-50"
                >
                  <div className="font-semibold cursor-pointer hover:underline" onClick={() => router.push(`/campaigns/${campaign.id}`)}>
                    {campaign.name}
                  </div>
                  <div><StatusBadge status={campaign.status} /></div>
                  <div>{campaign.totalLeads ?? 0}</div>
                  <div>{campaign.successfulLeads ?? 0}</div>
                  <div>{responseRate}%</div>
                  <div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className={`
                          h-2 rounded
                          ${campaign.status === 'Completed' ? 'bg-blue-500' :
                            campaign.status === 'Active' ? 'bg-green-500' :
                            campaign.status === 'Paused' ? 'bg-yellow-400' : 'bg-gray-300'}
                        `}
                        style={{ width: `${responseRate}%` }}
                      />
                    </div>
                  </div>
                  <div>{campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : '—'}</div>
                  <div className="flex gap-1">
                    <button className="text-xs text-blue-600 underline" onClick={() => {/* open edit modal, prefill */}}>Edit</button>
                    <button className="text-xs text-yellow-600 underline" onClick={() => handlePauseResume(campaign)}>{campaign.status === "Paused" ? "Resume" : "Pause"}</button>
                    <button className="text-xs text-red-600 underline" onClick={() => deleteMutation.mutate(campaign.id)}>Delete</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <CampaignModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateCampaign}
      />
    </div>
  );
}
