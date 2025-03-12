module.exports = {
    apps: [
      {
        name: 'procurement_server', // Name of your application
        script: 'node_modules/.bin/next', // Path to Next.js binary
        args: 'start', // Command to start the app
        cwd: './', // Current working directory (your project root)
        exec_mode: 'fork', // Enables clustering for better performance
        instances: 1, // Number of instances (adjust based on your needs)
        env: {
          NODE_ENV: 'production', // Set environment to production
          PORT: 8080
        },
        watch: true, // Do not watch for changes in production
      },
    ],
  };
