import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function CampaignSettingsTab({ campaign }: { campaign: any }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete campaign");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      router.push("/campaigns"); // Redirect to Campaigns list after delete
    }
  });

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6 max-w-xl">
      <h2 className="text-lg font-semibold">Campaign Details</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Campaign Name</label>
        <input className="border rounded px-3 py-2 w-full" defaultValue={campaign.name} disabled />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Campaign Status</label>
        <input type="checkbox" checked={campaign.status === "Active"} disabled className="mr-2" />
        <span>{campaign.status}</span>
      </div>
      <div className="border-t pt-4">
        <h3 className="text-red-600 font-semibold mb-2">Danger Zone</h3>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            if (window.confirm("Really delete this campaign?")) {
              deleteMutation.mutate(campaign.id);
            }
          }}
        >
          Delete Campaign
        </button>
      </div>
    </div>
  );
}
