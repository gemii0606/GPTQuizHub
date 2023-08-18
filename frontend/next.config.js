/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO:之後記得把這個註解解掉
  //   async redirects() {
  //     return [
  //       {
  //         source: "/:path((?!login$)(?!api/).*)",
  //         permanent: false,
  //         missing: [
  //           {
  //             type: "cookie",
  //             key: "access_token",
  //           },
  //         ],
  //         destination: "/login",
  //       },
  //       {
  //         source: "/login",
  //         has: [
  //           {
  //             type: "cookie",
  //             key: "access_token",
  //           },
  //         ],
  //         permanent: true,
  //         destination: "/",
  //       },
  //     ];
  //   },
};

module.exports = nextConfig;
