import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 90,
          background: "#000",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "36px",
          fontWeight: 800,
          letterSpacing: "-2px",
          color: "#FFD700",
          fontFamily: "sans-serif",
        }}
      >
        LH
      </div>
    ),
    {
      ...size,
    }
  );
}
