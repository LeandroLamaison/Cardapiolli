import React from 'react';
import {useHistory} from 'react-router-dom';

import './style.css';
import api from '../../services/api';

interface Props {
    id: Number;
    image: string;
    name: string;
    ingredients: string;
    price: string;
    main: boolean;
    password: string;
    email: string;
}

const EditPlate: React.FC<Props> = ({id, image, name, ingredients, price, main = false, password, email}) => {
    
    const history = useHistory();

    function handleNavigateToEdit() {
        history.push(`/profile/${email}/${id}`);
    }

    async function handleCheckMain(event: React.ChangeEvent<HTMLInputElement>) {
        const formData = new FormData();
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': password
        }

        if(event.target.checked) {
            formData.append('main', 'true');

            await api.put(`plates/${id}`, formData, {
                headers
            });

        }
        else {
            formData.append('main', 'false');

            await api.put(`plates/${id}`, formData, {
                headers
            });
        }
    }

    return (
        <div className='editPlateWrapper'>
            <div className="editPlate">
                <button onClick={handleNavigateToEdit}>
                    <img className="plateImg"
                        src={`http://localhost:3333/uploads/${image}`} 
                        alt="Imagem do prato"
                    />
                </button>
                <div className="plateData">
                    <h3 className='plateName'>{name}</h3>
                    <p className='ingredients'> {ingredients} </p>
                    <p className="price">{price} R$</p>
                    <div className='main'>
                        <input contentEditable={true} defaultChecked={main} onChange={handleCheckMain} className='checkmark' type='checkbox' name='main'/>
                        <label htmlFor="main">Principal</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditPlate;