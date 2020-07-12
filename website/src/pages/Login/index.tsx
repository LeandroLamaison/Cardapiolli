import React, { useState, FormEvent } from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiArrowLeftCircle} from 'react-icons/fi';

import logo from '../../assets/logo.svg';

import './style.css';
import api from '../../services/api';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');

    const history = useHistory();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        
        const menu = api.get(`restaurants/${email}`, { 
            headers: {
                authorization: password
            }
        }).catch(() => {
            setMessage('Usuário não encontrado');
        });

        if(menu) {
            localStorage.setItem('userPassword', password);

            history.push(`profile/${email}`);
        } 
    }

    return (
        <div id='login-page'>
            <header>
                <img src={logo} alt='Cardapiolli' /> 
                <Link className='back link' to='/'>
                    <FiArrowLeftCircle color='#000000' size={95}/>
                </Link>
            </header>

            <div className='formWrapper'>

                <form className='form' onSubmit={handleSubmit}>
                    <h1 className='title'> Acesse sua conta </h1>
                       
                    <div className='input-group'>
                        <div className='email formInput'>
                            <label htmlFor="email"> E-mail </label>
                            <br />
                            <input 
                                type="email" 
                                name='email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete='off'
                                required
                            />
                        </div>
                        <div className='password formInput'>
                            <label htmlFor="password"> Password </label>
                            <br /> 
                            <input 
                                type="password" 
                                name='password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                minLength={6}
                                autoComplete='off'
                                required
                            />
                        </div>
                    </div>

                    <p className='errorMessage'>{message}</p>
        
                    <div className='submitWrapper'>
                        <button type='submit' className='submit'> Fazer login</button>
                    </div>

                </form>  
            </div>      
        </div>
    )
}

export default Login;