import React, { useState, useEffect } from 'react';
import {FiArrowLeftCircle, FiPhone} from 'react-icons/fi';
import { Link , RouteComponentProps} from 'react-router-dom';

import logo from '../../assets/logo.svg';
import Plate from '../../components/Plate';
import api from '../../services/api';

import './style.css';

interface Menu {
    name: string;
    street: string;
    number: Number;
    city: string;
    uf: string;
    phone: string;
    plates: {
        id: Number;
        image: string;
        name: string;        
        ingredients: string;
        price: Number;
    }[];
}

interface TProps {
    menu: string;
}


const Detail = ({match}: RouteComponentProps<TProps>) => {
    const [invalid, setInvalid] = useState(false);
   
    const [menu, setMenu] = useState({} as Menu);


    useEffect(() => {
        const menuEmail = match.params.menu;

        api.get(`restaurants/${menuEmail}`).then(res => {
            setMenu(res.data);
        }).catch(() => {
            setInvalid(true)
        });

    }, [match.params.menu]);

    if(invalid) {
        return (
            <div> Conteúdo não encontrado</div>
        )
    }

    function handleLoadPlates() {
        if(menu.plates) {
            return menu.plates.map(plate => {
                return (
                    <Plate 
                        key={String(plate.id)}
                        image={plate.image}
                        name={plate.name}
                        ingredients={plate.ingredients}
                        price={plate.price}
                    />
                )
            }) 
        }
    }

    return (
        <div id='detail-page'>
            <header>
                <img src={logo} alt='Cardapiolli' /> 
                <div className='wrapper'>
                    <Link className='back link' to='/'>
                        <FiArrowLeftCircle color='#000000' size={95}/>
                    </Link>
                    <div className='restaurantData'>
                        <h1 className="name">{menu.name}</h1>
                        <div className='adress'>
                            <p>{menu.street} {menu.number}</p>
                            <p>{menu.city} ({menu.uf})</p>
                        </div>
                        <div className='phone'>
                            <FiPhone size={50}/>
                            <span> {menu.phone}</span>
                        </div>
                    </div>
                </div>
            </header>
            <div className='plateList'>
                {   
                    handleLoadPlates()
                }
            </div>
        </div>
    )
}

export default Detail;