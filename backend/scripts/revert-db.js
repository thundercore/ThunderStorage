const exec = require('child_process').exec

const command = process.env.NODE_ENV
  ? './node_modules/.bin/typeorm migration:revert --config dist/config/ormconfig.js'
  : 'ts-node -r tsconfig-paths/register ./node_modules/.bin/typeorm migration:revert --config src/config/ormconfig.ts'

exec(command, function(error, stdout, stderr) {
  console.log('stdout: ' + stdout)
  console.log('stderr: ' + stderr)
  process.exit(0)
  if (error !== null) {
    console.log('exec error: ' + error)
    process.exit(1)
  }
})
