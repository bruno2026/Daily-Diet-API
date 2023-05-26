import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('refeicao', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id')
    table.string('nome')
    table.string('descricao')
    table.dateTime('data_hora')
    table.boolean('esta_na_dieta')
    table.integer('user').unsigned().references('user.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('refeicao')
}
