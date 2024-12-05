import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt } from "react-icons/fa";
import { addLeaseContractThunk } from '../../redux/leases';
import { useModal } from '../../context/Modal';


const DragAndDropUploadModal = ({ propertyId }) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [ errors, setErrors ] = useState({});
    const { closeModal } = useModal();
    const dispatch=useDispatch();
    const navigate = useNavigate();


    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0]; // Get the first file
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const formData = new FormData();
    formData.append("lease_doc", file);

    // console.log("File: ", file);
    // for (const [key, value] of formData.entries()) {
        // console.log(`${key}:`, value);
    // }

    
    const handleUpload = (e) => {
        setErrors({});
        e.preventDefault();

        
        if (!file) {
            setErrors({ message: "File cannot be empty." });
            return;
        }
        
     
        dispatch(addLeaseContractThunk(propertyId, formData))
        .then(closeModal)
        .then(() => navigate(`/properties/${propertyId}`))
        .catch(error => setErrors(error));
        
    }


    return (
        <div
            className={`drop-zone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        > 
         
            <p><FaCloudUploadAlt size={58}/></p>
            <p style={{fontWeight:'bold',
                color: file?  'red': 'black'
            }}>
                {file ? `Selected File: ${file.name}` : "Drag & Drop a file "}
            </p>
            <p>
                or
            </p>
            <input
                id="file-upload"
                type="file"
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <label htmlFor="file-upload" className="browse-button">
                Click to Browse Files
            </label>
            <button 
                className='upload-button'
                onClick={handleUpload}
                >Save</button>
            {errors?.message && <p className='hint'>{errors.message}</p>}

        </div>
    );
};

export default DragAndDropUploadModal;