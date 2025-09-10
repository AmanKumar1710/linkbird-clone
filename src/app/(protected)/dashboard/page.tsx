"use client";
import { useQuery } from "@tanstack/react-query";

// --- Add your interface types here ---
interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface Activity {
  id?: string;
  name: string;
  campaignName?: string;
  campaign_id?: string;
  status: string;
}

// You can add interface for LinkedIn accounts if you fetch those dynamically

export default function DashboardPage() {
  // Fetch campaigns from your backend
  const { data: campaigns = [], isLoading: isCampaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/campaigns");
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return res.json();
    },
  });

  // Fetch recent lead activity (fetch a limited/sorted set of recent leads)
  const { data: activities = [], isLoading: isActivityLoading } = useQuery<Activity[]>({
    queryKey: ["recent-leads"],
    queryFn: async () => {
      // For example, sort by lastContactDate/createdAt DESC LIMIT 10
      const res = await fetch("/api/leads?recent=1&limit=10");
      if (!res.ok) throw new Error("Failed to fetch activity");
      return res.json();
    },
  });

  // Static LinkedIn Accounts for now
  const accounts = [
    {
      name: "Pulkit Garg",
      email: "1999pulkitgarg@gmail.com",
      status: "Connected",
      requests: 17,
      maxRequests: 30,
    },
    {
      name: "Jivesh Lakhani",
      email: "jljivesh@gmail.com",
      status: "Connected",
      requests: 19,
      maxRequests: 30,
    },
    {
      name: "Indrajit Sahani",
      email: "indrajit38mig@gmail.com",
      status: "Connected",
      requests: 18,
      maxRequests: 30,
    },
    {
      name: "Bhavya Arora",
      email: "bhavyaarora199.ba@gmail.com",
      status: "Connected",
      requests: 18,
      maxRequests: 100,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Campaigns and LinkedIn Accounts */}
      <div className="col-span-2 flex flex-col gap-6">

        {/* Campaigns - Real Data */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Campaigns</h2>
            <button className="bg-gray-100 rounded px-3 py-1 text-xs font-medium">
              All Campaigns <span className="ml-1 text-md">▼</span>
            </button>
          </div>
          {isCampaignsLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div>
              {(campaigns as Campaign[]).map((c) => (
                <div key={c.id} className="flex justify-between items-center py-2 border-b last:border-none">
                  <span>{c.name}</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">{c.status}</span>
                </div>
              ))}
              {campaigns.length === 0 && (
                <div className="text-center text-gray-400 py-6">No campaigns found.</div>
              )}
            </div>
          )}
        </div>

        {/* LinkedIn Accounts - Static Example */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-4">LinkedIn Accounts</h2>
          <div>
            {accounts.map((acc, idx) => (
              <div key={idx} className="flex items-center py-2 border-b last:border-none">
                {/* Circle Initials */}
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-2">
                  {acc.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </div>
                <span className="font-medium">{acc.name}</span>
                <span className="text-xs text-gray-500 ml-2">{acc.email}</span>
                <span className="bg-blue-100 text-blue-700 ml-auto px-2 py-0.5 rounded-full text-xs">{acc.status}</span>
                <div className="ml-2 w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(acc.requests / acc.maxRequests) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 ml-2">{acc.requests}/{acc.maxRequests}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity - Real Lead Activity */}
      <div>
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Recent Activity</h2>
            <button className="bg-gray-100 rounded px-3 py-1 text-xs font-medium">Most Recent <span className="ml-1 text-md">▼</span></button>
          </div>
          {isActivityLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            (activities as Activity[]).map((a, idx) => (
              <div key={a.id || idx} className="flex items-center gap-4 py-2 border-b last:border-none">
                {/* Initial */}
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-base font-bold mr-2">
                  {a.name ? a.name[0].toUpperCase() : "?"}
                </div>
                <span className="flex-1 font-medium truncate">{a.name}</span>
                <span className="text-xs text-gray-400">{a.campaignName || a.campaign_id || "—"}</span>
                {a.status === "Pending Approval" ? (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                    {a.status}
                  </span>
                ) : a.status?.includes("Sent") ? (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                    {a.status}
                  </span>
                ) : a.status === "Do Not Contact" ? (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
                    {a.status}
                  </span>
                ) : a.status?.toLowerCase().includes("followup") ? (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    {a.status}
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                    {a.status}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
