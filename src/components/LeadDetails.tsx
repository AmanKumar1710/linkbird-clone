"use client";

import { useUIStore } from "@/store/uiStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// Provide fallback values for demonstration if props absent
const MOCK_INVITATION =
  "Hi I'm building consultative AI for your company. Let's connect, I believe we can add 10x ROI for your workflow goals. This is a much longer message than shown by default so it will be collapsible.";
const MOCK_REPLY =
  "Hi, sounds interesting – let’s set up a quick call to discuss your AI consulting offer.";

export default function LeadDetail() {
  const { selectedLead, setSelectedLead } = useUIStore();
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showFullInvite, setShowFullInvite] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const queryClient = useQueryClient();

  // Mutation: delete
  const deleteMutation = useMutation({
    mutationFn: async (leadId: string) => {
      const res = await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      setSelectedLead(null);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  // Mutation: status update
  const statusMutation = useMutation({
    mutationFn: async (payload: { id: string; status: string }) => {
      const res = await fetch(`/api/leads/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: payload.status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedLead(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setSelectedLead]);

  if (!selectedLead) return null;

  const invitationMessage =
    selectedLead.invitationMessage || MOCK_INVITATION;
  const replyMessage = selectedLead.replyMessage || MOCK_REPLY;
  const campaignName = selectedLead.campaignName || selectedLead.campaign_id || "No Campaign";
  const invitationPreview = invitationMessage.slice(0, 70);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setSelectedLead(null)}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Sidesheet / Drawer */}
      <aside className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lead Profile</h2>
          <button
            onClick={() => setSelectedLead(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
              {selectedLead.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{selectedLead.name}</h3>
              <p className="text-sm text-gray-500">{selectedLead.email}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-gray-400">📍 {selectedLead.company || "Company not specified"}</span>
                <span className="text-xs text-gray-400"> | </span>
                <span className="text-xs text-gray-400">{campaignName}</span>
              </div>
            </div>
            <button
              className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
              title="Delete Lead"
              onClick={() => {
                if (window.confirm("Delete this lead? This cannot be undone.")) {
                  deleteMutation.mutate(selectedLead.id);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          {/* Status Badge and Dropdown */}
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              {selectedLead.status}
            </span>
            <select
              value={selectedLead.status}
              onChange={e =>
                statusMutation.mutate({ id: selectedLead.id, status: e.target.value })
              }
              className="border rounded px-2 py-1 text-xs"
            >
              <option value="Pending">Pending</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Contacted">Contacted</option>
              <option value="Responded">Responded</option>
              <option value="Converted">Converted</option>
              <option value="Do Not Contact">Do Not Contact</option>
            </select>
          </div>
        </div>

        {/* Additional Info toggle */}
        <div className="p-6 border-b border-gray-200">
          <button
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setShowProfileInfo((v) => !v)}
            aria-expanded={showProfileInfo}
          >
            <span className="text-sm font-medium text-gray-700">Additional Profile Info</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${showProfileInfo ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showProfileInfo && (
            <div className="mt-3 text-sm text-gray-600 px-2">
              <div>Phone: {selectedLead.phone || "N/A"}</div>
              <div>Location: {selectedLead.location || "N/A"}</div>
              <div>LinkedIn: {selectedLead.linkedin || "N/A"}</div>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="p-6 space-y-4">
          {/* Invitation Request */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-600">Invitation Request</h4>
              <p className="text-xs text-gray-500 mt-1">
                Message:{" "}
                {showFullInvite
                  ? invitationMessage
                  : invitationPreview +
                    (invitationMessage.length > invitationPreview.length ? "..." : "")}
              </p>
              {invitationMessage.length > invitationPreview.length && (
                <button
                  className="text-xs text-blue-600 hover:underline mt-1"
                  onClick={() => setShowFullInvite((v) => !v)}
                >
                  {showFullInvite ? "Show Less" : "See More"}
                </button>
              )}
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-600">Connection Status</h4>
              <p className="text-xs text-gray-500 mt-1">Check connection status</p>
            </div>
          </div>

          {/* Replied */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-600">Replied</h4>
              {showReply ? (
                <div className="text-xs text-gray-700 mt-1">{replyMessage}</div>
              ) : (
                <button
                  className="text-xs text-blue-600 hover:underline mt-1"
                  onClick={() => setShowReply(true)}
                >
                  View Reply
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
