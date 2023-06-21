// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'Knex/types/tables' {
  export interface Tables {
    user: {
      id: string
      name: string
      // amount: number
      created_at: string
      session_id?: string
    }
  }
}
