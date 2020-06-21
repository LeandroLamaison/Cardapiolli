import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('restaurants', table => {
        table.string('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.string('phone').notNullable();
        table.string('image').notNullable();
        table.integer('number').notNullable();
        table.string('street').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
        table.string('plates').defaultTo("");

        table.unique(['email']);
        table.unique(['password']);
        table.unique(['name', 'city', 'uf']);
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('restaurants');
}