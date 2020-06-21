import {celebrate, Segments, Joi} from 'celebrate';

export default {
    create: celebrate({
        [Segments.BODY]: Joi.object({}).keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            phone: Joi.string().required(),
            password: Joi.string().required().min(6),
            number: Joi.number().required(),
            street: Joi.string().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().min(2).max(2)
        })
    }),

    index: celebrate({
        [Segments.QUERY]: Joi.object().keys({
            page: Joi.number(),
            name: Joi.string(),
            city: Joi.string(),
            plate: Joi.string()
        })
    }),

    show: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            email: Joi.string().required()
        }),
        [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    }),

    change: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string(),
            email: Joi.string().email(),
            phone: Joi.string(),
            password: Joi.string().min(6),
            number: Joi.number(),
            street: Joi.string(),
            city: Joi.string(),
            uf: Joi.string().min(2).max(2)
        }),
        [Segments.PARAMS]: Joi.object().keys({
            email: Joi.string().required()
        }),
        [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    })

}