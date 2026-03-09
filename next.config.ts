import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: "/report-lost", destination: "/dashboard/report-lost", permanent: false },
      { source: "/report-found", destination: "/dashboard/report-found", permanent: false },
      { source: "/lost-items", destination: "/dashboard/lost-items", permanent: false },
      { source: "/found-items", destination: "/dashboard/found-items", permanent: false },
      { source: "/matches", destination: "/dashboard/matches", permanent: false },
      { source: "/profile", destination: "/dashboard/profile", permanent: false },
      { source: "/claims", destination: "/dashboard/admin/claims", permanent: false },
    ];
  },
};

export default nextConfig;
