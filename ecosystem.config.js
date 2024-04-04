module.exports = {
  apps: [
    {
      name: 'See3D Production Site',
      script: 'node',

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'bin/www',
      autorestart: true,
    },
  ],
};
