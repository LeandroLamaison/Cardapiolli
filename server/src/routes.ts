import express from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import RestaurantsController from './controllers/RestaurantsController';
import PlatesController from './controllers/PlatesController';

import restaurantsValidations from './validations/RestaurantsValidations';
import platesValidations from './validations/PlatesValidations';

const restaurantsController = new RestaurantsController();
const platesController = new PlatesController();


const routes = express.Router();
const upload = multer(multerConfig);

routes.post('/restaurants', upload.single('image'), restaurantsValidations.create, restaurantsController.create);
routes.get('/restaurants', restaurantsValidations.index, restaurantsController.index);
routes.get('/restaurants/:email', restaurantsValidations.show, restaurantsController.show);
routes.put('/restaurants/:email', upload.single('image'), restaurantsValidations.change, restaurantsController.change);

routes.post('/plates/:email', upload.single('image'), platesValidations.create, platesController.create);
routes.get('/plates/:id', platesValidations.show, platesController.show);
routes.put('/plates/:id', upload.single('image'), platesValidations.change, platesController.change);
routes.delete('/plates/:id', platesValidations.delete, platesController.delete);

export default routes;