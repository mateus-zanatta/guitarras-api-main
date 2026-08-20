import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const eventosRouter = Router()

// GET /eventos - Listar todos os eventos
eventosRouter.get('/', async (req: Request, res: Response) => {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        local: true,
        admin: true,
        agendas: {
          include: {
            cliente: true
          }
        }
      }
    })
    res.json(eventos)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar eventos' })
  }
})

// GET /eventos/:id - Buscar evento por ID
eventosRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const evento = await prisma.evento.findUnique({
      where: { id: Number(id) },
      include: {
        local: true,
        admin: true,
        agendas: {
          include: {
            cliente: true
          }
        }
      }
    })
    
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' })
    }
    
    res.json(evento)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar evento' })
  }
})

// GET /eventos/local/:id_local - Buscar eventos de um local
eventosRouter.get('/local/:id_local', async (req: Request, res: Response) => {
  try {
    const { id_local } = req.params
    const eventos = await prisma.evento.findMany({
      where: { id_local: Number(id_local) },
      include: {
        local: true,
        admin: true,
        agendas: {
          include: {
            cliente: true
          }
        }
      }
    })
    res.json(eventos)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar eventos do local' })
  }
})

// GET /eventos/admin/:id_admin - Buscar eventos de um admin
eventosRouter.get('/admin/:id_admin', async (req: Request, res: Response) => {
  try {
    const { id_admin } = req.params
    const eventos = await prisma.evento.findMany({
      where: { id_admin: Number(id_admin) },
      include: {
        local: true,
        admin: true,
        agendas: {
          include: {
            cliente: true
          }
        }
      }
    })
    res.json(eventos)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar eventos do admin' })
  }
})

// POST /eventos - Criar novo evento
eventosRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { artista, foto_artista, data_hora, acesso, portao, id_local, id_admin } = req.body
    
    const evento = await prisma.evento.create({
      data: {
        artista,
        foto_artista,
        data_hora: new Date(data_hora),
        acesso,
        portao,
        id_local,
        id_admin
      },
      include: {
        local: true,
        admin: true
      }
    })
    
    res.status(201).json(evento)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar evento' })
  }
})

// PUT /eventos/:id - Atualizar evento
eventosRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { artista, foto_artista, data_hora, acesso, portao, id_local, id_admin } = req.body
    
    const evento = await prisma.evento.update({
      where: { id: Number(id) },
      data: {
        artista,
        foto_artista,
        data_hora: new Date(data_hora),
        acesso,
        portao,
        id_local,
        id_admin
      },
      include: {
        local: true,
        admin: true
      }
    })
    
    res.json(evento)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar evento' })
  }
})

// DELETE /eventos/:id - Deletar evento
eventosRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.evento.delete({
      where: { id: Number(id) }
    })
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar evento' })
  }
})