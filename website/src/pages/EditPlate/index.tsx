import React, { useEffect, useState, FormEvent } from 'react';
import {Link, RouteComponentProps, useHistory} from 'react-router-dom';
import {FiArrowLeftCircle, FiTrash2} from 'react-icons/fi';

import logo from '../../assets/logo.svg';
import Dropzone from '../../components/Dropzone';
import api from '../../services/api';

import './style.css';

interface TParams {
    menu: string;
    plate: string;
}

interface PlateData {
    image: string;
    name: string;
    ingredients: string;
    price: number;
}

const EditPlate = ({match}: RouteComponentProps<TParams>) => {
    const [invalid, setInvalid] = useState(false);

    const plateId = match.params.plate;
    const [plateData, setPlateData] = useState({} as PlateData);
    
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState<File>();

    const [message, setMessage] = useState('');
    const [messageClass, setMessageClass] = useState('');

    const history = useHistory();

    useEffect(() => {
        api.get<PlateData>(`plates/${plateId}`).then(res => {
            setPlateData(res.data);
       }).catch(() => {
           setInvalid(true);
       });
    }, [plateId]);

    useEffect(() => {
        setName(plateData.name);
        setIngredients(plateData.ingredients);
        setPrice(plateData.price);
    }, [plateData.name, plateData.ingredients, plateData.price]);



    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        
        const formData = new FormData();

        if(image) formData.append('image', image);

        if(name !== plateData.name) formData.append('name', name);
        if(ingredients !== plateData.ingredients) formData.append('ingredients', ingredients);
        if(price !== plateData.price) formData.append('price', String(price));

        await api.put(`plates/${plateId}`, formData, {
            headers: {
                authorization: localStorage.getItem('userPassword')
            }
        }).then(res => {
            if(res.status === 200) {
                setMessage('Atualizado com sucesso');
                setMessageClass('success');
            }
            else {
                setMessage('Erro ao atualizar');
                setMessageClass('error');
            }
        });
    }

    async function handleDelete() {
       const deletePlate = window.confirm("Deseja excluir esse prato ?");

       if(deletePlate) {
           const {status: resStatus} = await api.delete(`plates/${plateId}`, {
               headers: {
                   'Authorization': localStorage.getItem('userPassword')
               }
           })
            .then(res => res)
            .catch(() => {
               window.alert('Ocorreu um erro durante a requisição');
               return {status: 400}
           });

           if(resStatus === 200) {
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
        <div id='edit-plate-page'>
            <header>
                <img src={logo} alt='Cardapiolli' />
                <Link className='back link' to={`/profile/${match.params.menu}`}>
                    <FiArrowLeftCircle color='#000000' size={95}/>
                </Link>
            </header>
            <div className='formWrapper'>

                <form className='form' onSubmit={handleSubmit}>
                    <div className='wrapper'>
                        <h1 className='title'> Alterar prato </h1>
                        <button onClick={handleDelete}>
                            <FiTrash2 size={105} color='red'/>
                        </button>
                    </div>
                    <Dropzone defaultValue={plateData.image} title='Imagem do prato' onFileUploaded={setImage}/>
                    <div className='inputs'>
                        <div className='name formInput'>
                            <label htmlFor="name"> Nome do prato</label>
                            <br />
                            <input 
                                type="text" 
                                name='name' 
                                defaultValue={plateData.name}
                                onChange={e => setName(e.target.value)}
                                autoComplete='off'
                                required
                            />
                        </div>
                        <div className='input-group'>
                            <div className='ingredients formInput'>
                                <label htmlFor="ingredients"> Ingredientes </label>
                                <textarea 
                                    className='formInput' 
                                    name='ingredients' 
                                    defaultValue={plateData.ingredients}
                                    onChange={e => setIngredients(e.target.value)}
                                    autoComplete='off'
                                    required 
                                />
                            </div>
                            <div className='price formInput'>
                                <label htmlFor="price"> Preço </label>
                                <br />
                                <input 
                                    type="number" 
                                    name='price' 
                                    defaultValue={plateData.price}
                                    onChange={e => setPrice(Number(e.target.value))}
                                    autoComplete='off'
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={messageClass}>{message}</div>

                    <div className='submitWrapper'>
                        <button type='submit' className='submit'> Atualizar prato</button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default EditPlate;