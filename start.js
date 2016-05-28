var pm2 = require('pm2')

var instances = process.env.WEB_CONCURRENCY || 2
var maxMemory = process.env.WEB_MEMORY || 400
var killTimeout = process.env.KILL_TIMEOUT || 1600

pm2.connect(true, function () {
  pm2.start({
    script: 'dist/server-iso-entrypoint.js',
    name: 'web',
    exec_mode: 'cluster',
    instances,
    kill_timeout: killTimeout,
    max_memory_restart: maxMemory + 'M',
    cron_restart: "0 * * * * *",
    env: {
      "NODE_ENV": "production",
    },
  }, function (err) {
    if (err)
      return console.error("Error while launching applications", err.stack || err);
    console.log("PM2 and app successfully started")
    pm2.launchBus(function(err, bus) {
      console.log('[PM2] Log streaming started')
      bus.on('log:out', function (packet) {
        console.log('[App:%s-%s] %s',
                    packet.process.name,
                    packet.process.pm_id,
                    packet.data)
      })

      bus.on('log:err', function (packet) {
        console.error('[App:%s][Err] %s', packet.process.name, packet.data)
      })
    })
  })
})
