const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const root = __dirname;

module.exports = {
  apps: [
    {
      name: 'tinradar-api',
      script: path.join(root, 'apps/api/dist/index.js'),
      cwd: path.join(root, 'apps/api'),
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        ...process.env,
      },
      error_file: '/var/log/tinradar/api-error.log',
      out_file: '/var/log/tinradar/api-out.log',
    },
    {
      name: 'tinradar-web',
      script: path.join(root, 'node_modules/.bin/next'),
      args: 'start',
      cwd: path.join(root, 'apps/web'),
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        ...process.env,
      },
      error_file: '/var/log/tinradar/web-error.log',
      out_file: '/var/log/tinradar/web-out.log',
    },
  ],
};
