import React, { useState, useEffect, FormEvent } from 'react';
import {Link, RouteComponentProps, useHistory} from 'react-router-dom';
import {FiArrowLeftCircle} from 'react-icons/fi';

import logo from '../../assets/logo.svg';
import Dropzone from '../../components/Dropzone';

import './style.css'
import api from '../../services/api';

interface TParams {
    menu: string;
}

interface Menu {
    image: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    street: string;
    number: number;
    city: string;
    uf: string;
}

const EditMenu = ({match}: RouteComponentProps<TParams>) => {
    const [invalid, setInvalid] = useState(false);
    
    const [menu, setMenu] = useState({} as Menu);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState(0);
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');
    const [image, setImage] = useState<File>();
    const [checkPassword, setCheckPassword] = useState('');

    const [message, setMessage] = useState('');

    const history = useHistory();

    useEffect(() => {
        api.get(`restaurants/${match.params.menu}`, {
            headers: {
                'Authorization': localStorage.getItem('userPassword')
            }
        }).then(res => {
            setMenu(res.data);
        }).catch(() => {
            setInvalid(true);
        });
    }, [match.params.menu]);

    useEffect(() => {
        setName(menu.name);
        setEmail(menu.email);
        setPhone(menu.phone);
        setStreet(menu.street);
        setNumber(menu.number);
        setCity(menu.city);
        setUf(menu.uf);
        setPassword(menu.password);
        setCheckPassword(menu.password);
    }, [menu]);


    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const data = new FormData();
            if(image) data.append('image', image);
            if(name !== menu.name) data.append('name', name);
            if(password !== menu.password) data.append('password', password);
            if(email !== menu.email) data.append('email', email);
            if(phone !== menu.phone) data.append('phone', phone);
            if(street !== menu.street) data.append('street', street);
            if(number !== menu.number) data.append('number', String(number));
            if(city !== menu.city) data.append('city', city);
            if(uf !== menu.uf) data.append('uf', uf);

            if(password !== checkPassword) {
                setMessage("Confirme corretamente a senha");
            }
            else {
                const {data: resData, status: resStatus} = await api.put(`restaurants/${match.params.menu}`, data, {
                    headers: {
                        'Authorization': localStorage.getItem('userPassword')
                    }
                }).then(res => res)
                  .catch(() => {
                        setMessage('Ocorreu um erro duranto a requisição. Registrar algum dos valores como NULL pode causar esse problema.');
                        return {data: {}, status: 400}
                    });
                
                if(resStatus !== 201) {
                    if(resData.code === 1 || resData.fields > 0) {
                        const translatedFields = [];
                            if(resData.fields.indexOf("password") !== -1) translatedFields.push("senha");
                            if(resData.fields.indexOf("name") !== -1) translatedFields.push("nome");
                            if(resData.fields.indexOf("email") !== -1) translatedFields.push("email");
                        
                        setMessage(`Campos de ${translatedFields.join(', ')} já registrados`);
                    }
                }
                else {
                    if(data.has('email') || data.has('password')) {
                        localStorage.clear();
                        window.alert('Email e/ou senha alterados com sucesso. Faça login novamente.');
                        history.push('/login');
                    }
                    else {
                        history.push(`/profile/${match.params.menu}`);
                    }
                }
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
        <div id='register-page'>
            <header>
                <img src={logo} alt='Cardapiolli' /> 
                <Link className='back link' to={`/profile/${match.params.menu}`}>
                    <FiArrowLeftCircle color='#000000' size={95}/>
                </Link>
            </header>
            <div className='formWrapper'>
                <form className='form' onSubmit={(e) => handleSubmit(e)}>
                    <h1 className='title'> Cadastro do Cardápio </h1>
                    <Dropzone defaultValue={menu.image} title='Imagem do estabelecimento' onFileUploaded={setImage} />

                    <div className='data'>
                        <h1 className='formTitle'>Dados</h1>
                        <div className='name formInput'>
                            <label htmlFor="name"> Nome do estabelecimento </label>
                            <br />
                            <input 
                                type="text" 
                                name='name' 
                                onChange={e => setName(e.target.value)} 
                                required
                                autoComplete='off'
                                minLength={3}
                                defaultValue={name}
                                pattern='.{0,}'
                            />
                        </div>
                        <div className='input-group'>
                            <div className='email formInput'>
                                <label htmlFor="email"> E-mail </label>
                                <br /> 
                                <input 
                                    type="email" 
                                    name='email' 
                                    onChange={e => setEmail(e.target.value)} 
                                    required
                                    autoComplete='off'
                                    defaultValue={email}
                                />
                            </div>
                            <div className='phone formInput'>
                                <label htmlFor="phone"> Telefone </label>
                                <br />
                                <input 
                                    type="text" 
                                    name='phone' 
                                    onChange={e => setPhone(e.target.value)} 
                                    required
                                    placeholder='XX XXXX-XXXX'
                                    autoComplete='off'
                                    defaultValue={phone}
                                    pattern='[0-9]{2}\s[0-9]{4}-[0-9]{4}$'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='address'>
                        <h1 className='formTitle'>Endereço</h1>
                        <div className='input-group'>
                            <div className='street formInput'>
                                <label htmlFor="street"> Rua </label>
                                <br /> 
                                <input 
                                    type="text" 
                                    name='street' 
                                    onChange={e => setStreet(e.target.value)}
                                    required
                                    autoComplete='off'
                                    defaultValue={street}
                                    pattern='[\w\sâãáàêéèíìõôóòûùúºª°]{0,}'
                                />
                            </div>
                            <div className='number formInput'>
                                <label htmlFor="number"> Número </label>
                                <br />
                                <input 
                                    type="number" 
                                    name='number' 
                                    onChange={e => setNumber(Number(e.target.value))}
                                    required
                                    autoComplete='off'
                                    value={number}
                                />
                            </div>
                        </div>
                        <div className='input-group'>
                            <div className='city formInput'>
                                <label htmlFor="city"> Cidade </label>
                                <br /> 
                                <input 
                                    type="text" 
                                    name='city' 
                                    onChange={e => setCity(e.target.value)}
                                    required
                                    autoComplete='off'
                                    defaultValue={city}
                                    pattern='[\w\sâãáàêéèíìõôóòûùúºª°]{0,}'
                                />
                            </div>
                            <div className='uf formInput'>
                                <label htmlFor="uf"> UF </label>
                                <br />
                                <input 
                                    type="text" 
                                    name='uf' 
                                    onChange={e => setUf(e.target.value)}
                                    required
                                    autoComplete='off'
                                    pattern='[A-Z]{0,}'
                                    minLength={2}
                                    maxLength={2}
                                    defaultValue={uf}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='passwordArea'>
                        <h1 className='formTitle'>Senha</h1>
                        <div className='passInput formInput'>
                            <label htmlFor="passInput"> Senha </label>
                            <br /> 
                            <input 
                                type='password' 
                                name='password' 
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete='off'
                                minLength={6}
                                defaultValue={password}
                            />
                        </div>
                        <div className='checkPass formInput'>
                            <label htmlFor="checkPass"> Confirmar senha </label>
                            <br />
                            <input 
                                type='password'
                                name='checkPass' 
                                onChange={(e) => setCheckPassword(e.target.value)}
                                required
                                autoComplete='off'
                                minLength={6}
                                defaultValue={checkPassword}
                            />
                        </div>
                    </div>

                    <p className='errorMessage'>{message}</p>

                    <div className='submitWrapper'>
                        <button type='submit' className='submit'> Cadastrar cardápio</button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default EditMenu;