import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const pagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isGitHubPages ? "/anastasia-tanem" : "");

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: pagesBasePath,
      }
    : {}),
};

export default nextConfig;
