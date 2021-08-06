module.exports = {
  apps : [{
    name: 'Garrett Dev',
    script: 'node',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'bin/www',
    autorestart: false,
    watch: true
  }]
};
