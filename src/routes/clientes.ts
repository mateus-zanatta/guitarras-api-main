import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const clientesRouter = Router()

// GET /clientes - Listar todos os clientes
clientesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        agendas: {
          include: {
            evento: {
              include: {
                local: true,
                admin: true
              }
            }
          }
        }
      }
    })
    res.json(clientes)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes' })
  }
})

// GET /clientes/:id - Buscar cliente por ID
clientesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: {
        agendas: {
          include: {
            evento: {
              include: {
                local: true,
                admin: true
              }
            }
          }
        }
      }
    })
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' })
    }
    
    res.json(cliente)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cliente' })
  }
})

// POST /clientes - Criar novo cliente
clientesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body
    
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        senha
      }
    })
    
    res.status(201).json(cliente)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente' })
  }
})

// PUT /clientes/:id - Atualizar cliente
clientesRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { nome, email, senha } = req.body
    
    const cliente = await prisma.cliente.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        senha
      }
    })
    
    res.json(cliente)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' })
  }
})

// DELETE /clientes/:id - Deletar cliente
clientesRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.cliente.delete({
      where: { id: Number(id) }
    })
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar cliente' })
  }
})