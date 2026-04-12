import { type FC } from "react";
import "./styles.css";

export interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

export const Tabs: FC<TabsProps> = ({ tabs, activeTab, onTabClick }) => (
  <div className="tabs">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
        onClick={() => onTabClick(tab.id)}
        type="button"
      >
        {tab.label}
      </button>
    ))}
  </div>
);
