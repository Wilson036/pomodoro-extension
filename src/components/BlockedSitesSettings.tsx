import React, { useState } from "react";
import { X, Plus, Globe } from "lucide-react";

interface BlockedSitesSettingsProps {
  blockedSites: string[];
  onBlockedSitesChange: (sites: string[]) => void;
}

const BlockedSitesSettings: React.FC<BlockedSitesSettingsProps> = ({
  blockedSites,
  onBlockedSitesChange,
}) => {
  const [newSite, setNewSite] = useState("");

  const addSite = () => {
    if (newSite.trim()) {
      // 清理輸入：移除 protocol、www、路徑等
      let site = newSite.trim().toLowerCase();

      // 移除 https:// 或 http://
      site = site.replace(/^https?:\/\//, '');

      // 移除 www.
      site = site.replace(/^www\./, '');

      // 只保留域名部分（移除路徑）
      site = site.split('/')[0];

      if (site && !blockedSites.includes(site)) {
        onBlockedSitesChange([...blockedSites, site]);
      }
      setNewSite("");
    }
  };

  const removeSite = (site: string) => {
    onBlockedSitesChange(blockedSites.filter((s) => s !== site));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSite();
    }
  };

  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "1rem",
        background: "#f9fafb",
        borderRadius: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <Globe style={{ width: "1rem", height: "1rem", color: "#6b7280" }} />
        <h3
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          專心時段封鎖網站
        </h3>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="例如: youtube.com, facebook.com"
          style={{
            flex: 1,
            padding: "0.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
          }}
        />
        <button
          onClick={addSite}
          style={{
            padding: "0.5rem",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#dc2626")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#ef4444")}
        >
          <Plus style={{ width: "1rem", height: "1rem" }} />
        </button>
      </div>

      {blockedSites.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {blockedSites.map((site) => (
            <div
              key={site}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem",
                background: "white",
                borderRadius: "0.375rem",
                border: "1px solid #e5e7eb",
              }}
            >
              <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                {site}
              </span>
              <button
                onClick={() => removeSite(site)}
                style={{
                  padding: "0.25rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                <X style={{ width: "1rem", height: "1rem" }} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            textAlign: "center",
            padding: "0.5rem",
          }}
        >
          尚未添加任何封鎖網站
        </p>
      )}

      <p
        style={{
          fontSize: "0.75rem",
          color: "#6b7280",
          marginTop: "0.75rem",
        }}
      >
        💡 只需輸入網域名稱（如 youtube.com），專心時間將自動封鎖這些網站
      </p>
    </div>
  );
};

export default BlockedSitesSettings;
