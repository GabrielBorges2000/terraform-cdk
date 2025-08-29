import { app } from './app'
import { checkConnectionDatabase } from './checks/check-database-connection'

const start = async () => {
  try {
    await app.listen({
      host: '0.0.0.0',
      port: 3333,
    })

    await checkConnectionDatabase()

    console.log('🚀 HTTP Server Running!')
  } catch (error) {
    console.error('Server error =>', error)
    process.exit(1)
  }
}

start()
