import knex from '../database/connection';
import {promisify} from 'util';
import fs from 'fs';
import path from 'path';

const asyncUnlink = promisify(fs.unlink);

export default async function() {
    const restaurants = await knex('restaurants').select('image');
    const plates = await knex('plates').select('image');

    const images = restaurants.map(restaurant => restaurant.image)
        .concat(plates.map(plate => plate.image));

    const dir = path.join(__dirname, '..', '..', 'uploads');

    fs.readdir(dir, (err, files) => {
        if(err) console.log(err);

        files.forEach(file => {
            if(!images.includes(file) && file !== 'none.jpg') asyncUnlink( path.join(dir, file) );
        })
    });
    
}