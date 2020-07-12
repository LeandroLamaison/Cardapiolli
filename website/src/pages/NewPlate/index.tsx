import React, { useState, FormEvent, useEffect } from 'react';
import {Link, useHistory, RouteComponentProps} from 'react-router-dom';
import {FiArrowLeftCircle} from 'react-icons/fi';

import logo from '../../assets/logo.svg';
import Dropzone from '../../components/Dropzone';

import './style.css';
import api from '../../services/api';

interface TProps {
    menu: string;
}

const NewPlate = ({match}: RouteComponentProps<TProps>) => {
    const [invalid, setInvalid] = useState(false);

    const [image, setImage] = useState<File>();
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [price, setPrice] = useState(0);

    const [message, setMessage] = useState('');

    const history = useHistory();

    useEffect(() => {
        api.get(`restaurants/${match.params.menu}`).catch(() => {
            setInvalid(true);
        })
    }, [match.params.menu])

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if(!image) {
            setMessage('O campo de imagem é obrigatório');
        }
        else {
            const formData = new FormData();
                formData.append('image', image);
                formData.append('name', name);
                formData.append('ingredients', ingredients);
                formData.append('price', String(price));
            
            const {status: resStatus} = await api.post(`plates/${match.params.menu}`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('userPassword')
                }
            })
                .then(res => res)
                .catch(() => {
                    setMessage('Ocorreu um erro durante a requisição');
                    return {data:{error: 'Unexpected error'}, status: 400}
                });

    
            if(resStatus === 201) {
                history.push(`/profile/${match.params.menu}`);
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
        <div id='new-plate-page'>
            <header>
                <img src={logo} alt='Cardapiolli' /> 
                <Link className='back link' to='/profile'>
                    <FiArrowLeftCircle color='#000000' size={95}/>
                </Link>
            </header>
            <div className='formWrapper'>

                <form className='form' onSubmit={handleSubmit}>
                    <h1 className='title'> Cadastrar prato </h1>
                    <Dropzone defaultValue='' title='Imagem do prato' onFileUploaded={setImage}/>
                    <div className='inputs'>
                        <div className='name formInput'>
                            <label htmlFor="name"> Nome do prato</label>
                            <br />
                            <input 
                                type="text" 
                                name='name'
                                autoComplete='off'
                                onChange={e => setName(e.target.value)}
                                minLength={3}
                                required
                            />
                        </div>
                        <div className='input-group'>
                            <div className='ingredients formInput'>
                                <label htmlFor="ingredients"> Ingredientes </label>
                                <textarea 
                                    className='formInput' 
                                    name='ingredients'
                                    autoComplete='off'
                                    onChange={e => setIngredients(e.target.value)}
                                    minLength={3}
                                    required
                                />
                            </div>
                            <div className='price formInput'>
                                <label htmlFor="price"> Preço </label>
                                <br />
                                <input 
                                    type="number" 
                                    name='price'
                                    autoComplete='off'
                                    onChange={e => setPrice(Number(e.target.value))}
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <div className='errorMessage'>{message}</div>

                    <div className='submitWrapper'>
                        <button type='submit' className='submit'> Cadastrar prato</button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default NewPlate;