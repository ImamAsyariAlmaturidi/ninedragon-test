import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Mengaktifkan Strict Mode untuk pengembangan
  swcMinify: true, // Mengaktifkan SWC untuk minifikasi dan optimasi build
  webpack(config, { isServer }) {
    // Menambahkan fallback untuk masalah dengan dependensi seperti fs, path, os (untuk menghindari masalah dengan Sequelize)
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
