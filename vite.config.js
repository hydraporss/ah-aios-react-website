export default {
  // Relative asset URLs work on GitHub Pages project paths and on local/static hosts.
  base: './',
  server: {
    proxy: {
      '/api': { target: process.env.WORLDFORGE_API_PROXY || 'http://127.0.0.1:8000', changeOrigin: false },
    },
  },
};
