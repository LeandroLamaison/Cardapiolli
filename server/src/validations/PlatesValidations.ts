import {celebrate, Segments, Joi} from 'celebrate';

export default {
    create: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required(),
            price: Joi.string().required(),
            ingredients: Joi.string().required(),
            main: Joi.string()
        }),
        [Segments.PARAMS]: Joi.object().keys({
            email: Joi.string().required()
        }),
        [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    }),

    show: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
        })
    }),

    change: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string(),
            ingredients: Joi.string(),
            price: Joi.number(),
            main: Joi.string()
        }),
        [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
        }),
        [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    }),

    delete: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
        }),
        [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    })

}