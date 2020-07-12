import React from 'react';
import {FiPhone} from 'react-icons/fi';

import MenuPlate from '../MenuPlate';

import './style.css';
import { useHistory } from 'react-router-dom';

interface Props {
    image: string;
    name: string;
    email: string;
    street: string;
    number: Number;
    city: string;
    uf: string;
    phone: string;
    main_plates: {
        id: Number;
        image:string;
        name: string;
        ingredients: string;
        price: Number;
    }[];
}

const Menu: React.FC<Props> = ({image, name, email, street, number, city, uf, phone, main_plates}) => {
    const history = useHistory();

    if(main_plates.length > 4) {
        for(let i=main_plates.length; i > 4; i--) {
            main_plates.shift();
        }
    }
    else if(main_plates.length < 4) {
        for(let i=main_plates.length; i < 4; i++) {
            let blankPlate = {
                id: -(i),
                image: "none.jpg",
                name: "Não Especificado",
                ingredients: "não especificado",
                price: 0.00
            }

            main_plates.push(blankPlate);
        }
    }

    function handleNavigateToDetail(menu: string) {
        history.push(`detail/${menu}`);
    }
    
    
    return (
        <div className='menuWrapper'>
            <div className="menu">
                <div className="restaurant">
                <button className='linkButton' onClick={() => handleNavigateToDetail(email)}>
                    <img className='restaurantImage'
                        src={`http://localhost:3333/uploads/${image}`}
                        alt="Imagem do estabelecimento" 
                    />
                </button>
                    <div className='restaurantData'>
                        <h1 className='name'>{name}</h1>
                        <div className="adress">
                            <p>{street} {number}</p>
                            <p>{city} ({uf})</p>
                         </div>
                        <p className='phone'>
                            <FiPhone size={25}/> {phone}
                        </p>
                    </div>
                </div>
                <div className="plateList">
                    { 
                        main_plates.map(plate => {
                            return (
                                <MenuPlate 
                                    key={String(plate.id)}
                                    image={plate.image}
                                    name={plate.name}
                                    ingredients={plate.ingredients}
                                    price={plate.price}
                                />
                            )       
                        })
                    }
                </div>
            </div>
       </div>
    );
}

export default Menu;