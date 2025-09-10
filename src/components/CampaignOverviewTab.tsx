import { useQuery } from "@tanstack/react-query";

// Type for a minimal lead; add more fields if needed
interface Lead {
  id: string;
  name: string;
  company?: string;
  status: string;
  [key: string]: any;
}

export default function CampaignOverview({ campaign }: { campaign: any }) {
  // Fetch leads for this campaign
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["leads", campaign.id],
    queryFn: async () => {
      const res = await fetch(`/api/leads?campaign_id=${campaign.id}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Compute metrics with correct typing
  const totalLeads = leads.length;
  const contacted = leads.filter((l: Lead) =>
    l.status === "Contacted" || l.status === "Responded" || l.status === "Converted"
  ).length;
  const successful = leads.filter((l: Lead) => l.status === "Converted").length;
  const responded = leads.filter((l: Lead) => l.status === "Responded").length;

  const acceptanceRate = totalLeads ? Math.round((contacted / totalLeads) * 100) : 0;
  const replyRate = totalLeads ? Math.round((responded / totalLeads) * 100) : 0;
  const conversionRate = totalLeads ? Math.round((successful / totalLeads) * 100) : 0;

  return (
    <div>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="rounded border bg-white p-6 shadow">
          <h3 className="mb-2 font-semibold">Total Leads</h3>
          <p className="text-3xl">{totalLeads}</p>
        </div>
        <div className="rounded border bg-white p-6 shadow">
          <h3 className="mb-4 font-semibold">Campaign Details</h3>
          <p>Status: <strong>{campaign.status}</strong></p>
          <p>Start Date: <strong>{campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : "—"}</strong></p>
          <p>Conversion Rate: <strong>{conversionRate}%</strong></p>
        </div>
      </div>

      <div className="rounded border bg-white p-6 shadow">
        <h3 className="mb-4 font-semibold">Campaign Progress</h3>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Leads Contacted</span>
            <span>{acceptanceRate}%</span>
          </div>
          <div className="h-2 rounded bg-gray-200">
            <div className="h-2 rounded bg-green-600" style={{width: `${acceptanceRate}%`}} />
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Acceptance Rate</span>
            <span>{acceptanceRate}%</span>
          </div>
          <div className="h-2 rounded bg-gray-200">
            <div className="h-2 rounded bg-blue-600" style={{width: `${acceptanceRate}%`}} />
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Reply Rate</span>
            <span>{replyRate}%</span>
          </div>
          <div className="h-2 rounded bg-gray-200">
            <div className="h-2 rounded bg-yellow-400" style={{width: `${replyRate}%`}} />
          </div>
        </div>
      </div>
    </div>
  );
}
