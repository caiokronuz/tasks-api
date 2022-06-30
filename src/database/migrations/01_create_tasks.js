import knex from 'knex';

export async function up(knex){
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.boolean('done').notNullable().defaultTo(false);

        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    });
}

export async function down(knex){
    return knex.schema.dropTable('tasks');
}