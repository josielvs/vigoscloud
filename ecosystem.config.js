module.exports = {
  apps: [
    {
      name: 'api_vigoscloud',
      script: './api/index.js',
      instances: 'max',
      restart_delay: 500,
      watch: './api'
    },
    {
      name: 'ux_vigoscloud',
      script: 'npm start --prefix ./ux',
      instances: 'max',
      restart_delay: 500,
      watch: './ux'
    },
  ]
};

