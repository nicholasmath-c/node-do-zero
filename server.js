// import { createServer } from 'node:http'

// const server = createServer((request, response) => {
//   response.write('oi')

//   return response.end()
// }) // criação do server

// server.listen(3333) // inicia o server na porta 3333


import { fastify } from 'fastify'
// import { DatabaseMemory } from './database-memory.js'
import { DatabasePostgres } from './database-postgres.js'

const server = fastify()

// const database = new DatabaseMemory()
const database = new DatabasePostgres()

//https://localhost:3333/videos
server.post('/videos', async (request, reply) => {

  // database.create({
  //   title: 'Video 01',
  //   description: 'Esse é o vídeo 01',
  //   duration: 100
  // })

  const { title, description, duration } = request.body

  await database.create({
    title,
    description,
    duration
  })

  return reply.status(201).send()
})

//https://localhost:3333/videos
server.get('/videos', async (request) => {
  const search = request.query.search

  const videos = await database.list(search)

  return videos
})

//https://localhost:3333/videos/id
server.put('/videos/:id', (request, reply) => {
  const videoId = request.params.id

  const { title, description, duration } = request.body

  database.update(videoId, {
    title,
    description,
    duration
  })

  return reply.status(204).send()
})

//https://localhost:3333/videos/id
server.delete('/videos/:id', (request, reply) => {
  const videoId = request.params.id

  database.delete(videoId)

  return reply.status(204).send()
})

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333,
})