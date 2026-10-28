export default function DevBadge() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        left: 12,
        zIndex: 9999,
        padding: "6px 12px",
        borderRadius: 999,
        background: "#d97706",
        color: "#fff",
        font: "600 13px/1 system-ui, sans-serif",
        letterSpacing: "0.05em",
        pointerEvents: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)"
      }}
    >
      LOCAL
    </div>
  );
}
