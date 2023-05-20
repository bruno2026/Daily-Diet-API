import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'hello world'
})

app
  .listen({
    port: 3333,
  })
  .then(function () {
    console.log('http server running')
  })
