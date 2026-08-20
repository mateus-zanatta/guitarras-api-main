import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const locaisRouter = Router()

// GET /locais - Listar todos os locais
locaisRouter.get('/', async (req: Request, res: Response) => {
  try {
    const locais = await prisma.local.findMany({
      include: {
        eventos: {
          include: {
            admin: true,
            agendas: {
              include: {
                cliente: true
              }
            }
          }
        }
      }
    })
    res.json(locais)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar locais' })
  }
})

// GET /locais/:id - Buscar local por ID
locaisRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const local = await prisma.local.findUnique({
      where: { id: Number(id) },
      include: {
        eventos: {
          include: {
            admin: true,
            agendas: {
              include: {
                cliente: true
              }
            }
          }
        }
      }
    })
    
    if (!local) {
      return res.status(404).json({ error: 'Local não encontrado' })
    }
    
    res.json(local)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar local' })
  }
})

// POST /locais - Criar novo local
locaisRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { nome, endereco, numero, cidade, foto } = req.body
    
    const local = await prisma.local.create({
      data: {
        nome,
        endereco,
        numero,
        cidade,
        foto
      }
    })
    
    res.status(201).json(local)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar local' })
  }
})

// PUT /locais/:id - Atualizar local
locaisRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { nome, endereco, numero, cidade, foto } = req.body
    
    const local = await prisma.local.update({
      where: { id: Number(id) },
      data: {
        nome,
        endereco,
        numero,
        cidade,
        foto
      }
    })
    
    res.json(local)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar local' })
  }
})

// DELETE /locais/:id - Deletar local
locaisRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.local.delete({
      where: { id: Number(id) }
    })
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar local' })
  }
})