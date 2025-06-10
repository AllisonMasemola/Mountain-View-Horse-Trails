/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    devIndicators: false,
    distDir: 'dist',
    // basePath: '/Mountain-View-Horse-Trails',
}

export default nextConfig