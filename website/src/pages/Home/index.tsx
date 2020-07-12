import React, {useState, useEffect, ChangeEvent, FormEvent} from 'react';
import {Link} from 'react-router-dom';
import {FiSearch} from 'react-icons/fi';

import logo from '../../assets/logo.svg';
import Menu from '../../components/Menu';
import api from '../../services/api';

import './style.css';

interface Menu {
    image: string;
    name: string;
    street: string;
    number: Number;
    city: string;
    uf: string;
    phone: string;
    email: string;
    main_plates: {
        id: Number;
        image: string;
        name: string;
        ingredients: string;
        price: Number;
    }[];
}

interface Filters {
    name: string;
    city: string;
    plate: string;
}

const Home = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const page = localStorage.getItem('page') || localStorage.getItem('page') === null ? Number(localStorage.getItem('page')) : 1;

    const [filters, setFilters] = useState<Filters>({
        name: "",
        city: "",
        plate: ""
    });

    useEffect(() => {
        api.get('restaurants', {params: {page}}).then(res => {
            setMenus(res.data);
        });
    }, [page]);


    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        let params = {} as Filters;

        if(filters.name !== "") params.name = filters.name;
        if(filters.city !== "") params.city = filters.city;
        if(filters.plate !== "") params.plate = filters.plate;

        api.get('restaurants', {
            params: {
                ...params
            }
        }).then(res => {
            setMenus(res.data);
        });
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;

        setFilters({...filters, [name]: value});

    }


    function handleNext() {
        localStorage.setItem('page', String(page + 1));
        window.location.reload(false);
    }

    function handleBack() {
        localStorage.setItem('page', String(page - 1));
        window.location.reload(false);
    }

    return (
        <div id='home-page'>
            <header>
                <div className='title'>
                    <img src={logo} alt='Cardapiolli' />
                    <h1>Um cardápio de cardápios</h1>
                </div>
                <div className='wrapper'>
                    <div className='accessAccount'>
                        <h1>Acesse o seu cardápio aqui</h1>
                        <div className='links'>
                            <Link className='link' to='/login'><h1>Login</h1></Link>
                            <Link className='link' to='/register'><h1>Cadastre-se</h1></Link>
                        </div>
                    </div>
                    <form className='filters' onSubmit={handleSubmit}>
                        <div className="filterWrapper">
                            <input 
                                type='text'
                                className='filterInput filterRestaurant' 
                                placeholder='Estabelecimento'
                                name='name'
                                value={filters.name}
                                onChange={handleInputChange}
                                autoComplete='off'
                            />
                            <button type="submit" className='search' onSubmit={handleSubmit}>
                                <FiSearch size={45}/>
                            </button>
                        </div>
                        
                        <div className='filterWrapper'>
                            <input 
                                type='text' 
                                className='filterInput filterCity'  
                                placeholder='Cidade'
                                name='city'
                                value={filters.city}
                                onChange={handleInputChange}
                                autoComplete='off'
                            />
                            <input 
                                type='text' 
                                className='filterInput filterPlate'  
                                placeholder='Prato'
                                name='plate'
                                value={filters.plate}
                                onChange={handleInputChange}
                                autoComplete='off'
                            />
                        </div> 
                    </form>
                </div>
            </header>
            <div className='menuList'>
                {menus.map(menu => {
                    return (
                        <Menu
                            key={menu.email}
                            email={menu.email} 
                            image={menu.image}
                            name={menu.name} 
                            street={menu.street}
                            number={menu.number}
                            city={menu.city}
                            uf={menu.uf}
                            phone={menu.phone}
                            main_plates={menu.main_plates}
                        />
                    );
                })}
            </div>
            <div className='navigatePages'>
                {   
                    page > 1 ? (<button onClick={handleBack} className=''>Página Anterior </button>): null
                }
                
                {
                    menus.length >= 50 ? (<button onClick={handleNext} className=''>Próxima Página </button>) : null
                }
            </div>
        </div>
    )
}

export default Home;