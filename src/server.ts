import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
  })
  .then(function () {
    console.log('http server running')
  })
