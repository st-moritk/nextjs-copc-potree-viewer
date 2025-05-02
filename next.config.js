/** @type {import('next').NextConfig} */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";

module.exports = {
  // 静的エクスポートモードに切り替え
  output: "export",
  // リポジトリ名がサブパスになる場合の設定
  basePath: repo ? `/${repo}` : "",
  assetPrefix: repo ? `/${repo}/` : "",
};
