import React, { useState, useEffect } from 'react';
import {FiArrowLeftCircle, FiPhone, FiEdit, FiPlusSquare} from 'react-icons/fi';
import { Link, useHistory, RouteComponentProps } from 'react-router-dom';

import logo from '../../assets/logo.svg';
import EditPlate from '../../components/EditPlate';

import './style.css';
import api from '../../services/api';

interface Menu {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    street: string;
    number: Number;
    city: string;
    uf: string;
    plates: {
        id: Number;
        image: string;
        name: string;
        ingredients: string;
        price: string;
        main: boolean;
    }[]
}

interface TProps {
    menu: string;
}

const Profile = ({match}: RouteComponentProps<TProps>) => {
    const [invalid, setInvalid] = useState(false);

    const [menu, setMenu] = useState<Menu>({} as Menu); 

    useEffect(() => {
        api.get(`/restaurants/${match.params.menu}`, {
            headers: {
                authorization: localStorage.getItem('userPassword')
            }
        }).then(res => {
            setMenu(res.data);
        }).catch(() => {
            setInvalid(true);
        });
    }, [match.params.menu])

    const history = useHistory();

    function handleExit() {
        localStorage.clear();

        history.push('/');
    }
    
    function handleLoadPlates() {
        if(menu.plates) {
            return menu.plates.map(plate => {
                return (
                    <EditPlate
                        key={String(plate.id)}
                        id={plate.id}
                        image={plate.image}
                        name={plate.name}
                        ingredients={plate.ingredients}
                        price={plate.price}
                        password={menu.password}
                        email={menu.email}
                        main={plate.main}
                    />
                )
            }) 
        }
    }

    if(invalid) {
        return (
            <div> Conteúdo não encontrado</div>
        )
    }

    if(!localStorage.getItem('userPassword')) {
        return (
            <div> Faça login para acessar </div>
        );
    }

    return (
        <div id='profile-page'>
            <header>
                <img src={logo} alt='Cardapiolli' /> 
                <div className='wrapper'>
                    <button onClick={handleExit} className='back link' >
                        <FiArrowLeftCircle color='red' size={95} />
                    </button>
                    <div className='restaurantData'>
                        <div>
                            <h1 className="name">{menu.name}</h1>
                            <Link to={`/profile/${match.params.menu}/edit`} className='editButton'>
                                <FiEdit className='editIcon' size={75} color='#ff0000'/>
                            </Link>
                        </div>
                        <div className='adress'>
                            <p>{menu.street} {menu.number}</p>
                            <p>{menu.city} ({menu.uf})</p>
                        </div>
                        <div className='phone'>
                            <FiPhone size={50}/>
                            <span> {menu.phone} </span>
                        </div>
                    </div>
                </div>
            </header>
            <div className='plateList'>

                <div className='addWrapper'>
                    
                    <Link to={`/profile/${match.params.menu}/new-plate`} className='addPlate link'>
                        <FiPlusSquare color='#000000' size={170}/>
                    </Link>
                </div>

                {
                   handleLoadPlates()
                }
            </div>
        </div>
    )
}

export default Profile;