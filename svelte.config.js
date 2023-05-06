import adapter from '@sveltejs/adapter-auto';

const config = {
  kit: {
    adapter: adapter(),
  },
  files: {
    assets: '/static'
  }
};

export default config;
