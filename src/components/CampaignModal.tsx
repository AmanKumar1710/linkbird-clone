"use client";

import { useState, useEffect } from "react";

interface CampaignModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; status: string }) => Promise<void>;
  existingCampaign?: { id: string; name: string; status: string };
}

export default function CampaignModal({
  isModalOpen,
  onClose,
  onSave,
  existingCampaign,
}: CampaignModalProps) {
  const [name, setName] = useState(existingCampaign?.name ?? "");
  const [status, setStatus] = useState(existingCampaign?.status ?? "Active");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(existingCampaign?.name ?? "");
    setStatus(existingCampaign?.status ?? "Active");
  }, [existingCampaign]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ name, status });
      onClose();
    } catch {
      setIsSaving(false);
    }
  }

  if (!isModalOpen) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />
      <div className="fixed right-0 top-0 h-full w-96 bg-white p-6 overflow-auto z-50 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold">
          {existingCampaign ? "Edit Campaign" : "Create Campaign"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            <span className="block mb-1 font-medium">Campaign Name</span>
            <input
              type="text"
              required
              className="w-full rounded border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
              autoFocus
            />
          </label>
          <label>
            <span className="block mb-1 font-medium">Status</span>
            <select
              className="w-full rounded border p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSaving}
            >
              <option>Active</option>
              <option>Draft</option>
              <option>Paused</option>
              <option>Completed</option>
            </select>
          </label>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
