import React, {useState, ChangeEvent, FormEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiArrowLeftCircle} from 'react-icons/fi';

import logo from '../../assets/logo.svg';
import Dropzone from '../../components/Dropzone';
import api from '../../services/api';

import './style.css';


const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        number: '',
        city: '',
        uf: '',
        password: ''
    });
    const [selectedFile, setSelectedFile] = useState<File>();
    const [checkPassword, setCheckPassword] = useState(''); 
    const [message, setMessage] = useState('');

    const history = useHistory();

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;

        setFormData({...formData, [name]: value});
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if(!selectedFile) {
            setMessage("O campo de imagem é obrigatório");
        }
        else if(formData.password !== checkPassword) {
            setMessage("Insira a mesma senha nos dois campos");
        } 
        else {
            const data = new FormData();
                data.append('image', selectedFile);
                data.append('name', formData.name);
                data.append('email', formData.email);
                data.append('phone', formData.phone);
                data.append('street', formData.street);
                data.append('number', formData.number);
                data.append('city', formData.city);
                data.append('uf', formData.uf);
                data.append('password', formData.password);
            
            const {data: resData, status: resStatus} = await api.post('restaurants', data).then(res => res).catch(() => {
                setMessage('Ocorreu um erro durante a requisição. Registrar algum dos valores como NULL pode causar esse problema');
                return {status: 400, data: {error: 'Unexpected error'}};
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
                history.push('/login');
            }

            
            
        }

    }

    return (
        <div id='register-page'>
            <header>
                <img src={logo} alt='Cardapiolli' /> 
                <Link className='back link' to='/'>
                    <FiArrowLeftCircle color='#000000' size={95}/>
                </Link>
            </header>
            <div className='formWrapper'>
                <form className='form' onSubmit={(e) => handleSubmit(e)}>
                    <h1 className='title'> Cadastro do Cardápio </h1>
                    <Dropzone defaultValue='' title='Imagem do estabelecimento' onFileUploaded={setSelectedFile} />

                    <div className='data'>
                        <h1 className='formTitle'>Dados</h1>
                        <div className='name formInput'>
                            <label htmlFor="name"> Nome do estabelecimento </label>
                            <br />
                            <input 
                                type="text" 
                                name='name' 
                                onChange={handleInputChange} 
                                required
                                autoComplete='off'
                                minLength={3}
                                pattern='.{0,}'
                                
                            />
                            <small></small>
                        </div>
                        <div className='input-group'>
                            <div className='email formInput'>
                                <label htmlFor="email"> E-mail </label>
                                <br /> 
                                <input 
                                    type="email" 
                                    name='email' 
                                    onChange={handleInputChange} 
                                    required
                                    autoComplete='off'
                                />
                            </div>
                            <div className='phone formInput'>
                                <label htmlFor="phone"> Telefone </label>
                                <br />
                                <input 
                                    type="tel" 
                                    name='phone' 
                                    onChange={handleInputChange} 
                                    required
                                    placeholder='XX XXXX-XXXX'
                                    autoComplete='off'
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
                                    onChange={handleInputChange}
                                    required
                                    autoComplete='off'
                                    pattern='[\w\sâãáàêéèíìõôóòûùúºª°]{0,}'
                                />
                            </div>
                            <div className='number formInput'>
                                <label htmlFor="number"> Número </label>
                                <br />
                                <input 
                                    type="number" 
                                    name='number' 
                                    onChange={handleInputChange}
                                    required
                                    autoComplete='off'
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
                                    onChange={handleInputChange}
                                    required
                                    autoComplete='off'
                                    pattern='[\w\sâãáàêéèíìõôóòûùúºª°]{0,}'
                                />
                            </div>
                            <div className='uf formInput'>
                                <label htmlFor="uf"> UF </label>
                                <br />
                                <input 
                                    type="text" 
                                    name='uf' 
                                    onChange={handleInputChange}
                                    required
                                    autoComplete='off'
                                    pattern='[A-Z]{0,}'
                                    minLength={2}
                                    maxLength={2}
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
                                onChange={handleInputChange}
                                required
                                autoComplete='off'
                                minLength={6}
                            />
                        </div>
                        <div className='checkPass formInput'>
                            <label htmlFor="checkPass"> Confirmar senha </label>
                            <br />
                            <input 
                                type='password'
                                name='checkPass' 
                                onChange={(e) => {setCheckPassword(e.target.value)}}
                                required
                                autoComplete='off'
                                minLength={6}
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

export default Register;