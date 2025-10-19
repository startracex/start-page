import type { NextConfig } from "next";

let output = process.env.NEXT_PUBLIC_OUTPUT as undefined | "export" | "standalone";
if (output !== "export" && output !== "standalone") {
  output = undefined;
}
const basePath = output === "export" ? process.env.NEXT_PUBLIC_BASE_PATH : undefined;

const nextConfig: NextConfig = {
  output,
  basePath,
};

export default nextConfig;
