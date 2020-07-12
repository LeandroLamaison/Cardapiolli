import {Request, Response, NextFunction} from 'express';

import knex from '../database/connection';

interface Plate {
    name: string;
    ingredients: string;
    image: string;
    price: Number;
    main: boolean;
}

interface PlateUpdate {
    name: string;
    ingredients: string;
    price: Number;
}

class PlatesController {

    async create(request: Request, response: Response, next: NextFunction) {
        const {email} = request.params;
        const {authorization} = request.headers;
        const {name, ingredients, price} = request.body;
        const main = request.body.main !== null && request.body.main !== undefined ? true: false;

        if(!request.file) return response.status(400).json({message: 'Image required'});

        const restaurant = await knex('restaurants')
            .where({email})
            .select(['id','password', 'plates'])
            .first()
            .catch(() => {return false});

        if(!restaurant) return response.status(404).send();
        if(restaurant.password !== authorization) return response.status(401).send();

        //Handler attempt to register a unique key field already registered
            const check_restaurant = restaurant.id;
                
            const uniqueFieldError = {
                status: false,
                fields: new Array(),
                message: "Field already registered"
            };
            
            const checkName = await knex('plates')
                .select('name')
                .where({name, restaurant: check_restaurant});

            if(checkName.length > 0) {
                uniqueFieldError.status = true;
                uniqueFieldError.fields.push("name");
            };

            if(uniqueFieldError.status) {
                return response.status(400).json({error: uniqueFieldError.message, fields: uniqueFieldError.fields});
            }

        //-----------------------------------------------------------------------------------------------------------

        const trx = await knex.transaction();

        await trx('plates').insert({
            image: request.file.filename,
            name,
            price,
            ingredients,
            main,
            restaurant: restaurant.id
        });


        let serializedPlates = restaurant.plates.split(',').map( (plate: string) => plate.trim());
        if( serializedPlates[0] === "") serializedPlates.shift();
        serializedPlates.push(name);

        await trx('restaurants').where(restaurant, restaurant.id).update({plates: serializedPlates.toString()});

        trx.commit();

        response.status(201).send();
    }

    async show(request: Request, response: Response) {
        const {id} = request.params;

        const plate = await knex('plates').select('*').where({id}).first().catch(() => false);
        if(!plate) return response.status(404).send();

        const restaurant = await knex('restaurants').select(['name', 'city', 'uf']).where({id: plate.restaurant}).first().catch(() => false);
        if(!restaurant) return response.status(404).send();

        response.json({...plate, restaurant});
    }

    async change(request: Request, response: Response, next: NextFunction) {
        const {id} = request.params;
        const {authorization} = request.headers;
        const {main} = request.body;
        const fields = ['name', 'ingredients', 'price'];

        const plate = await knex('plates').select(['restaurant', 'image', 'name']).where({id}).first().catch(() => false);
        if(!plate) {
            return response.status(404).send();
        };

        const restaurant = await knex('restaurants').select(['password', 'plates']).where('id', plate.restaurant).first().catch(() => false);
        if(!restaurant) {
            return response.status(404).send();
        };
        if(restaurant.password !== authorization) {
            return response.status(401).send();
        };

        let updateFields: Plate = {} as Plate;
        fields.forEach( field => {
            updateFields[field as keyof PlateUpdate] = request.body[field]; 
        });

        if(request.file) updateFields.image = request.file.filename;
        
        if(main) {
            if(main === 'true') {
                updateFields.main = true;
            }
            else if(main === 'false') {
                updateFields.main = false;
            }
        }

        const trx = await knex.transaction();

        await trx('plates').update(updateFields).where({id}).catch(err => next(err));

        if(updateFields.name) {
            let serializedPlates = restaurant.plates.split(',').map((plate: string) => plate.trim());
            serializedPlates.splice(serializedPlates.indexOf(plate.name), 1, updateFields.name);

            await trx('restaurants').where({id: plate.restaurant}).update({plates: serializedPlates.toString()});
        }

        trx.commit();

        response.status(200).send();
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const {id} = request.params;
        const authorization = request.headers.authorization;

        const plate = await knex('plates').select(['restaurant', 'image', 'name']).where({id}).first().catch(() => false);
        if(!plate) return response.status(404).send();

        const restaurant = await knex('restaurants').select(['password', 'plates']).where('id', plate.restaurant).first().catch(() => false);
        if(!restaurant) return response.status(404).send();
        if(restaurant.password !== authorization) return response.status(401).send();

        const trx = await knex.transaction();

        await trx('plates').delete('*').where({id}).catch(err => next(err));

        let serializedPlates = restaurant.plates.split(',').map((plate: string) => plate.trim());
        serializedPlates.splice(serializedPlates.indexOf(plate.name), 1);
        if(serializedPlates.length === 0) serializedPlates.push("");
        
        await trx('restaurants').where('password', restaurant.password).update({plates: serializedPlates.toString()});

        trx.commit();

        response.status(200).send();
    }
}

export default PlatesController;