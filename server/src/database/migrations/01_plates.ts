import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('plates', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('image').notNullable();
        table.string('ingredients').notNullable();
        table.float('price').notNullable();
        table.boolean('main').notNullable();
        table.string('restaurant').references('id').inTable('restaurants');

        table.unique(['name', 'restaurant']);
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('plates');
}