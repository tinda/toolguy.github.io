"use client";
import Link from "next/link";

export default function Page() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Toolguy - 多功能工具</h1>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <Link href="/url-converter">
          <button
            style={{
              padding: "8px 12px",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            網址轉換
          </button>
        </Link>

        <button
          onClick={() => {}}
          style={{
            padding: "8px 12px",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          功能二（留空）
        </button>
      </div>
    </div>
  );
}
