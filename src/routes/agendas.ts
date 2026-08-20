import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const agendasRouter = Router()

// GET /agendas - Listar todas as agendas
agendasRouter.get('/', async (req: Request, res: Response) => {
  try {
    const agendas = await prisma.agenda.findMany({
      include: {
        cliente: true,
        evento: {
          include: {
            local: true,
            admin: true
          }
        }
      }
    })
    res.json(agendas)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendas' })
  }
})

// GET /agendas/:id - Buscar agenda por ID
agendasRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const agenda = await prisma.agenda.findUnique({
      where: { id: Number(id) },
      include: {
        cliente: true,
        evento: {
          include: {
            local: true,
            admin: true
          }
        }
      }
    })
    
    if (!agenda) {
      return res.status(404).json({ error: 'Agenda não encontrada' })
    }
    
    res.json(agenda)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agenda' })
  }
})

// GET /agendas/cliente/:id_cliente - Buscar agendas de um cliente
agendasRouter.get('/cliente/:id_cliente', async (req: Request, res: Response) => {
  try {
    const { id_cliente } = req.params
    const agendas = await prisma.agenda.findMany({
      where: { id_cliente: Number(id_cliente) },
      include: {
        cliente: true,
        evento: {
          include: {
            local: true,
            admin: true
          }
        }
      }
    })
    res.json(agendas)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendas do cliente' })
  }
})

// POST /agendas - Criar nova agenda
agendasRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { id_cliente, id_evento } = req.body
    
    const agenda = await prisma.agenda.create({
      data: {
        id_cliente,
        id_evento
      },
      include: {
        cliente: true,
        evento: {
          include: {
            local: true,
            admin: true
          }
        }
      }
    })
    
    res.status(201).json(agenda)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar agenda' })
  }
})

// DELETE /agendas/:id - Deletar agenda
agendasRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.agenda.delete({
      where: { id: Number(id) }
    })
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar agenda' })
  }
})