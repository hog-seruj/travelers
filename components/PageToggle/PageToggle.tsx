// components/PageToggle/PageToggle.tsx
"use client";

type PageToggleProps = {
  activeTab: "saved" | "own";
  onTabChange: (tab: "saved" | "own") => void;
};

export default function PageToggle({ activeTab, onTabChange }: PageToggleProps) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <button
        onClick={() => onTabChange("saved")}
        style={{
          padding: "10px 20px",
          backgroundColor: activeTab === "saved" ? "#0070f3" : "#eaeaea",
          color: activeTab === "saved" ? "#fff" : "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Збережені історії
      </button>

      <button
        onClick={() => onTabChange("own")}
        style={{
          padding: "10px 20px",
          backgroundColor: activeTab === "own" ? "#0070f3" : "#eaeaea",
          color: activeTab === "own" ? "#fff" : "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Мої історії
      </button>
    </div>
  );
}