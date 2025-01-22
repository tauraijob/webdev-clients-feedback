module.exports = {
    apps: [
      {
        name: 'Webdev Reviews',
        port: '2029',
        exec_mode: 'cluster',
        instances: '1',
        script: './.output/server/index.mjs' 
      }
    ]
  }