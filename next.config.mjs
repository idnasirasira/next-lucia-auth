/** @type {import('next').NextConfig} */
const nextConfig = {
  // oslo webpack
  webpack: (config) => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
    return config;
  },
};

export default nextConfig;
