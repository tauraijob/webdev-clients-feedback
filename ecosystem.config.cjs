module.exports = {
    apps: [
      {
        name: 'Webdev Reviews',
        port: '3024',
        exec_mode: 'cluster',
        instances: '1',
        script: './.output/server/index.mjs' 
      }
    ]
  }