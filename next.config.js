/** @type {import('next').NextConfig} */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";

module.exports = {
  output: "export", // 静的エクスポートモードに切り替え
  basePath: repo ? `/${repo}` : "",
  assetPrefix: repo ? `/${repo}/` : "",
};
