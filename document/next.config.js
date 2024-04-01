const path = require('node:path');
const { config } = require('node:process');
const { WebpackSvgComponentPlugin } = require('../dist/modules')

/** @type {import('next').NextConfig} */
module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `
     
    `
  },
  webpack: (config) => {
    const plugins = config?.plugins || [];

    plugins.push(new WebpackSvgComponentPlugin({
      svgFileDir: './public/svgs', 
      outputDir: './src/components/common/svg',
      // removeViewBox: true,
      typescript: true,
      svgo: {
        plugins: [
          "removeDimensions"
        ]
      }
    }))

    return config;
  }
};