import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "#000",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          fontWeight: 800,
          letterSpacing: "-0.5px",
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
