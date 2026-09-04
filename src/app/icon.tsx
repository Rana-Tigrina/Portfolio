import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          background: "#161614",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#008066",
          borderRadius: 7,
          border: "1.5px solid #008066",
          fontWeight: 700,
          fontFamily: "monospace",
        }}
      >
        M
      </div>
    ),
    {
      ...size,
    }
  );
}
