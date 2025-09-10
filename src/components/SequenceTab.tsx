"use client";

import { useState } from "react";

export default function Sequence({ campaignId }: { campaignId: string }) {
  const [requestMessage, setRequestMessage] = useState("");
  const [connectionMessage, setConnectionMessage] = useState("");
  const [firstFollowup, setFirstFollowup] = useState("");
  const [secondFollowup, setSecondFollowup] = useState("");

  const variables = [
    { code: "{{fullName}}", label: "Full Name" },
    { code: "{{firstName}}", label: "First Name" },
    { code: "{{lastName}}", label: "Last Name" },
    { code: "{{jobTitle}}", label: "Job Title" },
  ];

  // Implement save handlers connected to your API endpoints.

  return (
    <div className="space-y-6">
      <div className="rounded border bg-white p-6 shadow">
        <h3 className="mb-4 font-semibold">Request Message</h3>
        <div className="mb-4 text-xs text-gray-600">
          Available variables:{" "}
          {variables.map((v) => (
            <kbd key={v.code} className="mr-2 rounded border bg-gray-100 px-1 py-0.5 text-xs font-mono">
              {v.code}
            </kbd>
          ))}
        </div>
        <textarea
          className="w-full rounded border p-2"
          rows={4}
          placeholder="Write your request message..."
          value={requestMessage}
          onChange={(e) => setRequestMessage(e.target.value)}
        />
        <div className="mt-2 flex space-x-4">
          <button className="rounded border px-4 py-1">Preview</button>
          <button className="rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700">Save</button>
        </div>
      </div>

      {/* Similar blocks for Connection Message, Follow-ups */}
    </div>
  );
}
