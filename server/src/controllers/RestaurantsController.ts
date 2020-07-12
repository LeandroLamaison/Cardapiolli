import {Request, Response, NextFunction} from 'express';
import crypto from 'crypto';

import knex from '../database/connection';

interface Restaurant {
    image: string;
    name: string;
    email: string;
    phone: string;
    number: Number;
    street: string;
    city: string;
    uf: string;
    plates: string;
    password: string;
    id: string;
}

interface RestrictedRestaurant {
    image: string;
    name: string;
    email: string;
    phone: string;
    number: Number;
    street: string;
    city: string;
    uf: string;
    plates: string[];
    main_plates: RestrictedRestaurant[];
}

interface Plate {
    id: number;
    name: string;
    image: string;
    price: number;
    ingredients: string;
    main: Boolean;
    restaurant: string;
}

interface RestrictPlate {
    id: number;
    name: string;
    image: string;
    price: number;
    ingredients: string;
    main: Boolean;
    restaurant: undefined;
}

class RestaurantsController {

    async create(request: Request, response: Response, next: NextFunction) {

        const {
            name,
            email,
            phone,
            street,
            number,
            city,
            uf,
            password
        } = request.body;

        const id = crypto.randomBytes(4).toString('hex');

        if(!request.file) return response.status(400).json({message: "Image required"});


        //Handler attempt to register a unique key field already registered

            const uniqueFieldError = {
                status: false,
                fields: new Array(),
                message: "Field already registered"
            };
            
            const checkName = await knex('restaurants').select('name').where({name, city, uf});
            const checkEmail = await knex('restaurants').select('email').where({email});
            const checkPassword = await knex('restaurants').select('password').where({password});

            if(checkName.length > 0) {
                uniqueFieldError.status = true;
                uniqueFieldError.fields.push("name");
            };
            if(checkEmail.length > 0) {
                uniqueFieldError.status = true;
                uniqueFieldError.fields.push("email");
            };
            if(checkPassword.length > 0) {
                uniqueFieldError.status = true;
                uniqueFieldError.fields.push("password");
            };

            if(uniqueFieldError.status) {
                return response.status(200).json({code: 1, error: uniqueFieldError.message, fields: uniqueFieldError.fields}).send();
            }

        //-----------------------------------------------------------------------------------------------------------

        await knex('restaurants')
            .insert({
                id,
                image: request.file.filename,
                name,
                email,
                password,
                phone,
                number,
                street,
                city,
                uf
            }).catch(() => {});

        return response.status(201).send();
    }

    async index(request: Request, response: Response, next: NextFunction) {
        const {name = false, city = false, plate = false, page = 1} = request.query;

        const [count] = await knex('restaurants').count();

        const restaurants = await knex('restaurants')
            .limit(50)
            .offset(50 * (Number(page) - 1))    
            .select('*');

        const filteredRestaurants = restaurants.filter(restaurant => 
            name ? restaurant.name.includes(String(name)) : true && 
            city ? restaurant.city.includes(String(city)) : true &&
            plate ? restaurant.plates.includes(String(plate)): true 
        );

        let restrictedRestaurants: RestrictedRestaurant[] = [];
        for(let i = 0; i < filteredRestaurants.length; i++) {
            const main_plates= await knex<Plate>('plates')
                .where({restaurant: filteredRestaurants[i].id, main: true})
                .select(['id', 'name', 'price', 'ingredients', 'image']);

            restrictedRestaurants[i] = {...filteredRestaurants[i], id: undefined, password: undefined, main_plates};
        }

        response
            .header('X-Total-Count', count['count(*)'])
            .json(restrictedRestaurants);
    }

    async show(request: Request, response: Response) {
        const {email} = request.params;
        const authorization = request.headers.authorization ? request.headers.authorization : false;
        
        const restaurant = await knex('restaurants').select('*').where({email}).first().catch(() => false);
        if(!restaurant) return response.status(404).send();

        const plates = await knex('plates').select('*').where('restaurant', restaurant.id).catch(() => false);
        if(!plates) return response.status(404).send();

        const serializedPlates = (plates as RestrictPlate[]).map(plate => {
            plate.restaurant = undefined;
            return plate;
        })

        if(authorization) {
            if(restaurant.password !== authorization) return response.status(401).send();

            response.json({
                ...restaurant,
               plates: serializedPlates
           });
        }
        else {
            const restrictedRestaurant = restaurant;

            restrictedRestaurant.id = undefined;
            restrictedRestaurant.password = undefined;

            response.json({
                ...restrictedRestaurant,
                plates: serializedPlates
           });
        }
        

    }

    async change(request: Request, response: Response) {
        const {email} = request.params;
        const {authorization} = request.headers;

        const restaurant = await knex('restaurants').where({email}).select('*').first().catch(() => false);

        if(!restaurant) return response.status(404).send();
        if(restaurant.password !== authorization) return response.status(401).send();

        //Handler attempt to register a unique key field already registered

            const {
                name: check_name = restaurant.name, 
                city: check_city = restaurant.city, 
                uf: check_uf = restaurant.uf, 
                password: check_password = restaurant.password, 
                email: check_email = restaurant.email
            } = request.body;
            
            const uniqueFieldError = {
                status: false,
                fields: new Array(),
                message: "Field already registered"
            };
            
            const checkName = await (await knex('restaurants').select(['id','name']).where({name: check_name, city: check_city, uf: check_uf})).filter(res => res.id !== restaurant.id);
            const checkEmail = await (await knex('restaurants').select('id','email').where({email: check_email})).filter(res => res.id !== restaurant.id);
            const checkPassword = await (await knex('restaurants').select('id','password').where({password: check_password})).filter(res => res.id !== restaurant.id);

            if(checkName.length > 0 ) {
                uniqueFieldError.status = true;
                uniqueFieldError.fields.push("name");
            };
            if(checkEmail.length > 0) {
                uniqueFieldError.status = true;
                uniqueFieldError.fields.push("email");
            };
            if(checkPassword.length > 0) {
                uniqueFieldError.status = true;
                uniqueFieldError.fields.push("password");
            };

            if(uniqueFieldError.status) {
                return response.status(200).json({code: 1, error: uniqueFieldError.message, fields: uniqueFieldError.fields}).send();
            }

        //-----------------------------------------------------------------------------------------------------------

        const {id} = restaurant;

        const fields = ['name', 'email', 'phone', 'number', 'street', 'city', 'uf', 'password'];

        let updateFields: Restaurant = {} as Restaurant;
        fields.forEach( field => {
            if(request.body[field]) {
                updateFields[field as keyof Restaurant] = request.body[field];
            }
        });
        
        if(request.file) updateFields.image = request.file.filename;

        await knex('restaurants').update(updateFields).where({id}).catch(err => response.json(err).send());

        response.status(201).send();
    }

}

export default RestaurantsController;