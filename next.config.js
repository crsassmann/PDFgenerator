const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserOrOrgPagesRepo = repoName.endsWith('.github.io');
const basePath =
  isGithubActions && repoName && !isUserOrOrgPagesRepo ? `/${repoName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath,
};

module.exports = nextConfig;
