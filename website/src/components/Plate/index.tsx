import React from 'react';

import './style.css';

interface Props {
    image: string;
    name: string;
    ingredients: string;
    price: Number;
}

const Plate: React.FC<Props> = ({image, name, ingredients, price}) => {
    return (
        <div className='plateWrapper'>
            <div className="plate">
                <img className="plateImg"
                    src={`http://localhost:3333/uploads/${image}`}
                    alt="Imagem do prato"
                />
                <div className="plateData">
                    <h3 className='plateName'>{name}</h3>
                    <p className='ingredients'> {ingredients} </p>
                    <p className="price">{price} R$</p>
                </div>
            </div>
        </div>
    );
}

export default Plate;