import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f4034"
        }}
      >
        <svg width="110" height="44" viewBox="0 0 40 16">
          <path
            d="M2 14 20 2l18 12"
            fill="none"
            stroke="#e3b48a"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            marginTop: 4,
            fontSize: 84,
            fontWeight: 700,
            color: "#fffcf7",
            fontFamily: "serif",
            lineHeight: 1
          }}
        >
          P
        </div>
      </div>
    ),
    size
  );
}
