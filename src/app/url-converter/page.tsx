"use client";
import React, { useState } from "react";

export default function Page() {
  // 輸入值與過濾後的結果
  const [input, setInput] = useState<string>("");
  const [sanitized, setSanitized] = useState<string>("");
  // 新增：複製狀態顯示
  const [copyStatus, setCopyStatus] = useState<string>("");

  // 簡單但實用的 emoji 移除正規表達式
  const removeEmoji = (str: string) =>
    str.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF]|[\uFE00-\uFE0F])/g,
      ""
    );

  // 處理按鈕按下：移除 emoji，並在字串內的每個 URL 加入或覆寫 cid=14626
  const handleApply = () => {
    const cleaned = removeEmoji(input);

    // 找到 http/https URL，並對每個 URL 用 URL 解析後設定 cid=14626
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const result = cleaned.replace(urlRegex, (match) => {
      // 有時候 match 會帶上結尾的標點，例如 "http://a.com,"，把常見的標點暫時剝離再還原
      const trailingMatch = match.match(/[.,)\]]+$/);
      const trailing = trailingMatch ? trailingMatch[0] : "";
      const core = trailing ? match.slice(0, -trailing.length) : match;

      try {
        const u = new URL(core);
        u.searchParams.set("cid", "14626");
        return u.toString() + trailing;
      } catch (e) {
        // 解析失敗就回傳原始 match
        return match;
      }
    });

    setSanitized(result);

    // 不再修改 window.location / history
  };

  // 新增：複製文字到剪貼簿（先用 navigator.clipboard，失敗時用 fallback）
  const handleCopy = async () => {
    if (!sanitized) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(sanitized);
      } else {
        // fallback for older browsers / environments
        const textarea = document.createElement("textarea");
        textarea.value = sanitized;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopyStatus("已複製");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (e) {
      setCopyStatus("複製失敗");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>網址轉換</h1>

      <div style={{ marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="在這裡輸入（emoji 會被移除，字串內的網址會加入 cid=14626）"
          style={{
            padding: "8px 12px",
            width: "100%",
            maxWidth: 600,
            fontSize: 16,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleApply}
          style={{
            padding: "8px 16px",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          套用
        </button>
      </div>

      {sanitized !== "" && (
        <div style={{ marginTop: 16 }}>
          <strong>過濾結果：</strong>
          <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{sanitized}</div>

          {/* 新增：手機友善的複製按鈕與狀態提示 */}
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleCopy}
              style={{
                padding: "8px 12px",
                fontSize: 14,
                cursor: "pointer",
                // 手機版按鈕可放大觸控面積
                minWidth: 80,
              }}
            >
              複製
            </button>
            {copyStatus && <span style={{ fontSize: 14 }}>{copyStatus}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
