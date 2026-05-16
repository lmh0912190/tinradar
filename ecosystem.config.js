const path = require('path');

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
        DATABASE_URL: 'postgresql://diemnong:CHANGE_ME@localhost:5432/diemnong',
        REDIS_URL: 'redis://localhost:6379',
        ANTHROPIC_API_KEY: 'sk-ant-CHANGE_ME',
        API_PORT: '3001',
        API_HOST: '127.0.0.1',
        INTERNAL_API_KEY: 'CHANGE_ME',
        GOOGLE_TRENDS_GEO: 'VN',
        GOOGLE_NEWS_HL: 'vi',
        GOOGLE_NEWS_GL: 'VN',
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
        PORT: '3000',
        DATABASE_URL: 'postgresql://diemnong:CHANGE_ME@localhost:5432/diemnong',
        REDIS_URL: 'redis://localhost:6379',
        NEXT_PUBLIC_API_URL: 'https://diemnong.vn/api',
        NEXT_PUBLIC_SITE_URL: 'https://diemnong.vn',
        INTERNAL_API_KEY: 'CHANGE_ME',
      },
      error_file: '/var/log/tinradar/web-error.log',
      out_file: '/var/log/tinradar/web-out.log',
    },
  ],
};
