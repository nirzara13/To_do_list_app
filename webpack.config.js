// 



const webpack = require('webpack');

module.exports = {
  // ... autre configuration ...
  resolve: {
    fallback: {
      "crypto": false // Désactiver le module crypto
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  devServer: {
    timeout: 120000, // 2 minutes
  },
};