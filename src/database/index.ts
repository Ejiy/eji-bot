import { connect } from 'mongoose'

export async function InitDB() {
  await connect((process.env.DATABASE_URL as string), {
    connectTimeoutMS: 5000
  }).then(() => {
    console.log('Database Initialized')
  }).catch((e) => {
    console.error(`Database Error: ${e}`)
  })
}

// Exporting all the shit from collection

export * from './collection/Warn.js'
export * from './collection/TicketSchema.js'
