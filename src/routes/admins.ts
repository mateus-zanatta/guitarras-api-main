import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const adminsRouter = Router()

// GET /admins - Listar todos os admins
adminsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const admins = await prisma.admin.findMany({
      include: {
        eventos: {
          include: {
            local: true,
            agendas: {
              include: {
                cliente: true
              }
            }
          }
        }
      }
    })
    res.json(admins)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar admins' })
  }
})

// GET /admins/:id - Buscar admin por ID
adminsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const admin = await prisma.admin.findUnique({
      where: { id: Number(id) },
      include: {
        eventos: {
          include: {
            local: true,
            agendas: {
              include: {
                cliente: true
              }
            }
          }
        }
      }
    })
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin não encontrado' })
    }
    
    res.json(admin)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar admin' })
  }
})

// POST /admins - Criar novo admin
adminsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body
    
    const admin = await prisma.admin.create({
      data: {
        nome,
        email,
        senha
      }
    })
    
    res.status(201).json(admin)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar admin' })
  }
})

// PUT /admins/:id - Atualizar admin
adminsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { nome, email, senha } = req.body
    
    const admin = await prisma.admin.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        senha
      }
    })
    
    res.json(admin)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar admin' })
  }
})

// DELETE /admins/:id - Deletar admin
adminsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.admin.delete({
      where: { id: Number(id) }
    })
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar admin' })
  }
})