import React, {useCallback, useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';

import './styles.css';

interface Props {
    onFileUploaded: (file: File) => void;
    title: string;
    defaultValue: string;
}

const Dropzone: React.FC<Props> = ({onFileUploaded, title, defaultValue}) => {
    const [selectedFileUrl, setSelectedFileUrl] = useState("");

    useEffect(() => {
        if(defaultValue && defaultValue !== '') {
            setSelectedFileUrl(`http://localhost:3333/uploads/${defaultValue}`);
        }
    }, [defaultValue]);
    
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);

        setSelectedFileUrl(fileUrl);
        onFileUploaded(file);
    }, [onFileUploaded]);

    const {getRootProps, getInputProps} = useDropzone({onDrop, accept:'image/*'})
    
    return (
        <div className="dropzone" {...getRootProps()}>
          <input {...getInputProps()} />
          {
              selectedFileUrl?
                <img src={selectedFileUrl} alt="Point thumbnail" /> :
                <p>{title}</p>
          }
        </div>
    )
}

export default Dropzone;