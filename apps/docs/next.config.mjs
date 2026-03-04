import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/react-facebook',
  reactStrictMode: true,
};

export default withMDX(nextConfig);
