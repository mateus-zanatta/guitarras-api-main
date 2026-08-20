import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    url: "postgresql://neondb_owner:npg_GrEcCd9k4VWl@ep-broad-dream-acbxgvhb-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  }
})