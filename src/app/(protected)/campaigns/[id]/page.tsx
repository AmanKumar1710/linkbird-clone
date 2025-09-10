"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import CampaignOverview from "@/components/CampaignOverviewTab";
import CampaignLeads from "@/components/CampaignLeadsTab";
import Sequence from "@/components/SequenceTab";
import CampaignSettings from "@/components/CampaignSettingsTab";

const tabs = ["Overview", "Leads", "Sequence", "Settings"] as const;
type Tab = typeof tabs[number];

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      if (!res.ok) throw new Error("Failed to fetch campaign");
      return await res.json();
    },
  });

  if (isLoading) return <div className="p-8">Loading...</div>;

  if (!campaign) return <div className="p-8 text-center">Campaign not found.</div>;

  return (
    <div className="p-6">
      <nav className="mb-4 text-sm text-gray-500">
        <button onClick={() => router.push("/campaigns")} className="hover:underline">
          Campaigns
        </button>{" "}
        / <span className="font-semibold">{campaign.name}</span>
      </nav>

      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{campaign.name}</h1>
        <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">{campaign.status}</span>
      </header>

      <nav className="flex border-b space-x-8 mb-6 text-sm font-semibold text-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 border-b-2 transition ${
              activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section>
        {activeTab === "Overview" && <CampaignOverview campaign={campaign} />}
        {activeTab === "Leads" && <CampaignLeads campaignId={campaignId} />}
        {activeTab === "Sequence" && <Sequence campaignId={campaignId} />}
        {activeTab === "Settings" && <CampaignSettings campaign={campaign} />}
      </section>
    </div>
  );
}
