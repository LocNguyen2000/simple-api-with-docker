module.exports = {
  apps: [
    {
      name: 'app1',
      script: './src/main.mjs',
      env_production: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
