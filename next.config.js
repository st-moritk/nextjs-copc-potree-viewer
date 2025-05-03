/** @type {import('next').NextConfig} */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
const basePath = repo ? `/${repo}` : "";

module.exports = {
  // 静的エクスポートモードに切り替え
  output: "export",
  // リポジトリ名がサブパスになる場合の設定
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
