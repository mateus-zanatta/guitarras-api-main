# 🎸 Guitarras & Cia — API REST

API REST para gerenciamento de venda de guitarras, desenvolvida com **Node.js**, **TypeScript**, **Express** e **Prisma ORM** com banco de dados **MySQL**.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:

- [Node.js](https://nodejs.org/) — versão 18 ou superior
- [npm](https://www.npmjs.com/) — já vem com o Node.js
- [MySQL](https://www.mysql.com/) — servidor rodando localmente ou em nuvem
- [Git](https://git-scm.com/)

---

## 🚀 Primeiros passos após clonar o repositório

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/guitarras_db"
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_de_app"
```

> **Atenção:** substitua `USUARIO`, `SENHA` pelos dados do seu MySQL.  
> Para o e-mail, use uma **senha de app** do Gmail (não a senha da conta).  
> [Como gerar senha de app no Gmail →](https://support.google.com/accounts/answer/185833)

### 3. Criar o banco de dados no MySQL

Abra seu cliente MySQL (Workbench, DBeaver, terminal) e execute:

```sql
CREATE DATABASE guitarras_db;
```

### 4. Rodar as migrations do Prisma

Esse comando cria todas as tabelas no banco de dados automaticamente:

```bash
npx prisma migrate dev --name init
```

### 5. Gerar o Prisma Client

```bash
npx prisma generate
```

### 6. Iniciar o servidor

```bash
npm run dev
```

O servidor estará rodando em: **http://localhost:3000**

Teste no navegador ou no Bruno — você deve ver:

```json
{ "message": "🎸 API Guitarras & Cia funcionando!" }
```

---

## 📁 Estrutura do Projeto

```
src/
├── routes/
│   ├── clientes.ts       # CRUD de clientes
│   ├── guitarras.ts      # CRUD de guitarras
│   └── vendas.ts         # Vendas com transações e e-mail
├── generated/
│   └── prisma/           # Prisma Client gerado automaticamente
└── server.ts             # Entrada da aplicação
prisma/
└── schema.prisma         # Modelos do banco de dados
.env                      # Variáveis de ambiente (não subir para repositório público)
```

---

## 🗄️ Modelos do Banco de Dados

| Tabela             | Descrição                                      |
|--------------------|------------------------------------------------|
| `Cliente`          | Dados do cliente + total de gastos             |
| `Guitarra`         | Catálogo de guitarras com estoque e preço      |
| `Venda`            | Registro de cada venda com total calculado     |
| `GuitarraVendida`  | Itens de cada venda (relacionamento N:N)       |

---

## 🔗 Rotas Disponíveis

### Clientes — `/clientes`

| Método | Rota            | Descrição              |
|--------|-----------------|------------------------|
| GET    | `/clientes`     | Lista todos os clientes|
| POST   | `/clientes`     | Cria um novo cliente   |
| PUT    | `/clientes/:id` | Atualiza um cliente    |
| DELETE | `/clientes/:id` | Deleta um cliente      |

### Guitarras — `/guitarras`

| Método | Rota              | Descrição                |
|--------|-------------------|--------------------------|
| GET    | `/guitarras`      | Lista todas as guitarras |
| POST   | `/guitarras`      | Cadastra uma guitarra    |
| PUT    | `/guitarras/:id`  | Atualiza uma guitarra    |
| DELETE | `/guitarras/:id`  | Deleta uma guitarra      |

### Vendas — `/vendas`

| Método | Rota                       | Descrição                                    |
|--------|----------------------------|----------------------------------------------|
| GET    | `/vendas/:id`              | Busca uma venda por ID                       |
| POST   | `/vendas`                  | Cria uma venda (transação completa)          |
| DELETE | `/vendas/:id`              | Cancela venda e restaura estoque             |
| GET    | `/vendas/email/:clienteId` | Envia histórico de compras por e-mail        |

---

## ⚙️ Scripts disponíveis

| Comando           | Descrição                              |
|-------------------|----------------------------------------|
| `npm run dev`     | Inicia o servidor em modo desenvolvimento |
| `npx prisma studio` | Abre interface visual do banco de dados |
| `npx prisma migrate dev` | Cria/atualiza as tabelas no banco  |

---

## 🧠 Lógica das Transações

### Criar Venda (`POST /vendas`)
1. Verifica se o cliente existe
2. Para cada item, verifica se a guitarra existe e se há estoque suficiente
3. Debita a quantidade do estoque de cada guitarra
4. Cria a venda com o total calculado (quantidade × preço)
5. Soma o total nos gastos do cliente
> Se qualquer etapa falhar, **nada é salvo** (rollback automático).

### Cancelar Venda (`DELETE /vendas/:id`)
1. Busca a venda e todos os seus itens
2. Devolve a quantidade de cada guitarra ao estoque
3. Desconta o total dos gastos do cliente
4. Deleta os itens e a venda
> Tudo em uma única transação com rollback automático.

---

## 👨‍💻 Tecnologias Utilizadas

- **Node.js** + **TypeScript**
- **Express** — framework HTTP
- **Prisma ORM** — acesso ao banco de dados
- **MySQL** — banco de dados relacional
- **Nodemailer** — envio de e-mails

---

## ⚠️ Observações

- Antes de deletar um cliente, **cancele todas as vendas** vinculadas a ele.
- A pasta `src/generated/` é gerada pelo Prisma e **não precisa ser editada manualmente**.
