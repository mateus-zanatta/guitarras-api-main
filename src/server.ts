import express, { Request, Response } from 'express'
import cors from 'cors'
import { clientesRouter } from './routes/clientes'
import { agendasRouter } from './routes/agendas'
import { eventosRouter } from './routes/eventos'
import { locaisRouter } from './routes/locais'
import { adminsRouter } from './routes/admins'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API de Agenda de Shows - Funcionando!' })
})

app.use('/clientes', clientesRouter)
app.use('/agendas', agendasRouter)
app.use('/eventos', eventosRouter)
app.use('/locais', locaisRouter)
app.use('/admins', adminsRouter)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})