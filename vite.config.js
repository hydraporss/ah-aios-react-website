const base = process.env.GITHUB_ACTIONS === 'true'
  ? '/learning-studio/'
  : '/';

export default {
  base,
  server: {
    proxy: {
      '/api': { target: process.env.WORLDFORGE_API_PROXY || 'http://127.0.0.1:8000', changeOrigin: false },
    },
  },
};
