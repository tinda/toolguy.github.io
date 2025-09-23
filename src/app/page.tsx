"use client";
import React, { useState } from "react";

export default function Page() {
  // 輸入值與過濾後的結果
  const [input, setInput] = useState<string>("");
  const [sanitized, setSanitized] = useState<string>("");
  // 新增：複製狀態顯示
  const [copyStatus, setCopyStatus] = useState<string>("");
  // 新增：分享狀態顯示
  const [shareStatus, setShareStatus] = useState<string>("");

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

    // 新增：移除所有的括號及內部內容，例如 "()" 或 "(內容)"
    // 使用 [\s\S]*? 以支援跨行的括號內容
    let noParens = result.replace(/\([\s\S]*?\)/g, "");

    // 整理多餘空白（保留換行，但合併多重空白）
    // 先保留換行位置，將連續空白（非換行）合併成一個空格
    noParens = noParens.replace(/[^\S\r\n]{2,}/g, " ");
    // 再移除行首尾多餘空白
    noParens = noParens
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .trim();

    setSanitized(noParens);

    // 不再修改 window.location / history
  };

  // 新增：清空輸入與結果與狀態
  const handleClear = () => {
    setInput("");
    setSanitized("");
    setCopyStatus("");
    setShareStatus("");
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

  // 新增：分享（優先使用 Web Share API，否則開啟外部分享連結作為 fallback）
  const handleShare = async () => {
    if (!sanitized) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: "分享內容", text: sanitized });
        setShareStatus("已分享");
      } else {
        // fallback：開啟 Twitter/X 的貼文組成頁（作為通用分享入口）
        const url = "https://www.threads.net/intent/post?" + encodeURIComponent(sanitized);
        window.open(url, "_blank", "noopener");
        setShareStatus("已開啟分享視窗");
      }
      setTimeout(() => setShareStatus(""), 2000);
    } catch (e) {
      setShareStatus("分享失敗");
      setTimeout(() => setShareStatus(""), 2000);
    }
  };

  // 判斷是否包含換行
  const hasNewline = input.includes("\n");

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>網址轉換</h1>

      <div style={{ marginTop: 12 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="在這裡輸入（emoji 會被移除，字串內的網址會加入 cid=14626）"
          rows={6}
          style={{
            padding: "8px 12px",
            width: "100%",
            maxWidth: 600,
            fontSize: 16,
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />
      </div>

      {/* 換行判斷顯示（簡單提示） */}
      <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
        包含換行：{hasNewline ? "是" : "否"}
      </div>

      {/* 套用 / 清空 按鈕列 */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
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

          <button
            onClick={handleClear}
            style={{
              padding: "8px 16px",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            清空
          </button>
        </div>
      </div>

      {sanitized !== "" && (
        <div style={{ marginTop: 16 }}>
          <strong>過濾結果：</strong>
          {/* pre-wrap 可保留換行顯示 */}
          <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{sanitized}</div>

          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleCopy}
              style={{
                padding: "8px 12px",
                fontSize: 14,
                cursor: "pointer",
                minWidth: 80,
              }}
            >
              複製
            </button>

            {/* 新增：分享按鈕（手機會觸發原生分享） */}
            <button
              onClick={handleShare}
              style={{
                padding: "8px 12px",
                fontSize: 14,
                cursor: "pointer",
                minWidth: 120,
              }}
            >
              分享到 Thread
            </button>

            {/* 顯示複製與分享狀態 */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {copyStatus && <span style={{ fontSize: 14 }}>{copyStatus}</span>}
              {shareStatus && <span style={{ fontSize: 14 }}>{shareStatus}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
