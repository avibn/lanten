/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "part3storage.blob.core.windows.net",
                pathname: "**",
            },
        ],
    },
    output: "standalone",
};

export default nextConfig;
