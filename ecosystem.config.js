module.exports = {
  apps: [
    {
      name: 'billetera',
      script: '.next/standalone/server.js',
      cwd: '/var/www/billetera',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      error_file: '/var/log/pm2/billetera-error.log',
      out_file: '/var/log/pm2/billetera-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
    },
  ],
}
