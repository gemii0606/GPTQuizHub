/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path((?!login$)(?!api/)(?!twoplayer/).*)",
        permanent: false,
        missing: [
          {
            type: "cookie",
            key: "access_token",
          },
        ],
        destination: "/login",
      },
      {
        source: "/login",
        has: [
          {
            type: "cookie",
            key: "access_token",
          },
        ],
        permanent: true,
        destination: "/",
      },
    ];
  },
};

module.exports = nextConfig;
