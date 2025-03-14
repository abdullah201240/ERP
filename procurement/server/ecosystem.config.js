const path = require('path');
module.exports ={
  apps: [
    {
      name: 'admin_server', // Name of the app
      script: 'dist/index.js', // Path to the main TypeScript file
      interpreter: 'ts-node', // Use ts-node to execute the TypeScript file
     instances: 1,
     exec_mode: 'fork',
      watch: true, // Optional: Enable watching files for changess
      ignore_watch: ['upload/**'],
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};