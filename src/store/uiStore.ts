import { create } from 'zustand';

type UIStore = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  campaignFilter: string;
  setCampaignFilter: (filter: string) => void;
  selectedLead: any | null;
  setSelectedLead: (lead: any | null) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  campaignFilter: "All",
  setCampaignFilter: (filter) => set({ campaignFilter: filter }),
  selectedLead: null,
  setSelectedLead: (lead) => set({ selectedLead: lead }),
}));
