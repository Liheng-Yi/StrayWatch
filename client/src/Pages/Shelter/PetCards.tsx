import React from 'react';
import { MapPin, Pencil, Share2 } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import PurpleButton from "../../Components/UI/lightPurpleButton";
import { Pet } from './client';

interface PetCardsProps {
  pets: Pet[];
  showEditButton: boolean;
  onDeletePet: (petId: string) => void;
  onEditPet: (pet: Pet) => void;
}

const PetCards: React.FC<PetCardsProps> = ({ 
  pets, 
  showEditButton, 
  onDeletePet, 
  onEditPet 
}) => {
  return (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      {pets.map((pet) => (
        <div key={pet._id} className="col">
          <div className="card h-100">
            <div className="row g-0">
              <div className="col-md-6">
                <img
                  src={pet.picture || "/api/placeholder/400/320"}
                  alt={pet.name}
                  className="img-fluid h-100 w-100 object-fit-cover"
                  style={{ maxHeight: '300px' }}
                />
              </div>
              <div className="col-md-6">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="card-title mb-1">{pet.name}</h5>
                      <small className="text-muted d-flex align-items-center">
                        <MapPin size={16} className="me-1" />
                        {pet.location}
                      </small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge ${
                        pet.status === 'Lost' ? 'bg-danger' : 'bg-success'
                      }`}>
                        {pet.status}
                      </span>
                      {showEditButton && (
                        <>
                          <button
                            className="btn btn-link text-secondary p-0 border-0"
                            onClick={() => onEditPet(pet)}
                            title="Edit pet"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="btn btn-link text-secondary p-0 border-0"
                            onClick={() => onDeletePet(pet._id)}
                            title="Delete pet"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-1"><strong>Type:</strong> {pet.kind}</p>
                    <p className="mb-1"><strong>Color:</strong> {pet.color}</p>
                    <p className="card-text small text-muted">
                      {pet.description}
                    </p>
                  </div>

                  <div className="d-flex gap-2">
                    <PurpleButton
                      variant="outline"
                      className="d-flex align-items-center"
                    >
                      <Share2 size={12} />
                      Share
                    </PurpleButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetCards; 