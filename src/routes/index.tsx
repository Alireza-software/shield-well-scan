import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VaccineShield Pro — Smart Immunization Management" },
      {
        name: "description",
        content:
          "Enterprise vaccine management, cold-chain monitoring, and immunization POS platform for public health programs.",
      },
      { property: "og:title", content: "VaccineShield Pro" },
      {
        property: "og:description",
        content:
          "Smart Immunization Management & Disease Prevention Platform.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/app/login.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", background: "#0F172A", color: "#fff" }}>
      <p>Loading VaccineShield Pro…</p>
    </div>
  );
}
