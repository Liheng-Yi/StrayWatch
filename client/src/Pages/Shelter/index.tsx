import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Routes, useNavigate } from 'react-router-dom';
import SpotPetForm from '../Landing/SpotPetForm';

interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    description: string;
    imageUrl: string;
}

const Shelter = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        description: '',
        imageUrl: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState('');

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const response = await axios.get('/api/pets');
            setPets(response.data);
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    
    const navigate = useNavigate();
    const handleAddPetClick = () => {
        navigate("/home/spot");
      };
    

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/pets/${id}`);
            fetchPets();
        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    };

    const handleEdit = (pet: Pet) => {
        setIsEditing(true);
        setEditingId(pet._id);
        setFormData({
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            age: pet.age.toString(),
            description: pet.description,
            imageUrl: pet.imageUrl,
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shelter Dashboard</h1>
            <br />
            <button onClick={handleAddPetClick} className="lost-found-button">
              Add Pets
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {/* Pet Cards Map -- shelter 
             pets.map((pet) => ().filter())} */}
            </div>
            
        
        </div>
    );
};

export default Shelter;