/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const securityHeaders = [
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // {
  //   key: "X-Frame-Options",
  //   value: "SAMEORIGIN",
  // },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/app/main-hall",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  i18n,
};

module.exports = nextConfig;
