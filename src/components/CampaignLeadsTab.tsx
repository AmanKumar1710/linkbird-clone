import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/store/uiStore";
import LeadDetail from "@/components/LeadDetails";

export default function CampaignLeads({ campaignId }: { campaignId: string }) {
  const { setSelectedLead } = useUIStore();
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads", campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/leads?campaign_id=${campaignId}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading leads...</div>;

  return (
    <div className="relative">
      <div className="rounded border bg-white p-6 shadow overflow-x-auto">
        <div className="grid grid-cols-4 gap-6 text-sm font-semibold border-b pb-3 mb-3">
          <div>Name</div>
          <div>Company</div>
          <div>Activity</div>
          <div>Status</div>
        </div>
        {leads.length === 0 && (
          <div className="py-20 text-center text-gray-500">No leads found for this campaign.</div>
        )}
        {leads.map((lead: any) => (
          <div
            key={lead.id}
            className="grid grid-cols-4 gap-6 items-center p-3 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedLead(lead)}
          >
            <div>{lead.name}</div>
            <div>{lead.company}</div>
            <div>
              <div className="h-2 w-16 rounded bg-yellow-400" />
            </div>
            <div>
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                {lead.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <LeadDetail />
    </div>
  );
}
