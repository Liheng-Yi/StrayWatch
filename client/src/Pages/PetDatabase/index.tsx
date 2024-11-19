import React, { useState } from 'react';
import { Share2, MapPin } from 'lucide-react';
import dogImage from '..//public/dog1.jpg';
import PurpleButton from '../../Components/UI/lightPurpleButton';

interface Pet {
  _id: string;
  color: string;
  name: string;
  kind: string;
  status: string;
  location: string;
  picture: string;
  description: string;
}

const PetSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'dogs' | 'cats'>('all');
  
  const pets: Pet[] = [
    {
      _id: '1',
      color: 'Brown and Black',
      name: 'Max/kevin',
      kind: 'Dog',
      status: 'Lost',
      location: 'Chandler, MN',
      picture: '/pic/dog1.png',
      description: 'Border Collie/German Shepherd mix, very friendly'
    },
    {
      _id: '2',
      color: 'Gray Tabby',
      name: 'susan',
      kind: 'Cat',
      status: 'Lost',
      location: 'Minneapolis',
      picture: '/pic/cat1.png',
      description: 'Indoor cat, very shy, wearing a blue collar'
    },
        {
      _id: '2',
      color: 'Gray Tabby',
      name: 'susan',
      kind: 'Cat',
      status: 'Lost',
      location: 'Minneapolis',
      picture: '/pic/cat1.png',
      description: 'Indoor cat, very shy, wearing a blue collar'
    },
        {
      _id: '2',
      color: 'Gray Tabby',
      name: 'susan',
      kind: 'Cat',
      status: 'Lost',
      location: 'Minneapolis',
      picture: '/pic/cat1.png',
      description: 'Indoor cat, very shy, wearing a blue collar'
    },
        {
      _id: '2',
      color: 'Gray Tabby',
      name: 'susan',
      kind: 'Cat',
      status: 'Lost',
      location: 'Minneapolis',
      picture: '/pic/cat1.png',
      description: 'Indoor cat, very shy, wearing a blue collar'
    },
        {
      _id: '2',
      color: 'Gray Tabby',
      name: 'susan',
      kind: 'Cat',
      status: 'Lost',
      location: 'Minneapolis',
      picture: '/pic/cat1.png',
      description: 'Indoor cat, very shy, wearing a blue collar'
    }
  ];

  const filteredPets = activeTab === 'all' 
    ? pets 
    : pets.filter(pet => pet.kind.toLowerCase() === activeTab.slice(0, -1));

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Lost Pets Search Database</h1>
      
      {/* Navigation Tabs */}
      <ul className="nav nav-pills justify-content-center mb-4">
        <li className="nav-item mx-2">
          <PurpleButton
            variant={activeTab === 'all' ? 'solid' : 'outline'}
            onClick={() => setActiveTab('all')}
            className="nav-link"
          >
            <i className="bi bi-paw me-2"></i>
            All Pets
          </PurpleButton>
        </li>
        <li className="nav-item mx-2">
          <PurpleButton
            variant={activeTab === 'dogs' ? 'solid' : 'outline'}
            onClick={() => setActiveTab('dogs')}
            className="nav-link"
          >
            <i className="bi bi-paw me-2"></i>
            Dogs
          </PurpleButton>
        </li>
        <li className="nav-item mx-2">
          <PurpleButton
            variant={activeTab === 'cats' ? 'solid' : 'outline'}
            onClick={() => setActiveTab('cats')}
            className="nav-link"
          >
            <i className="bi bi-paw me-2"></i>
            Cats
          </PurpleButton>
        </li>
      </ul>

      {/* Pet Cards Grid */}
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {filteredPets.map((pet) => (
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
                      <span className={`badge ${
                        pet.status === 'Lost' ? 'bg-danger' : 'bg-success'
                      }`}>
                        {pet.status}
                      </span>
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
                        <Share2 size={16} />
                        Share
                      </PurpleButton>
                      <PurpleButton variant="solid">
                        Contact
                      </PurpleButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="text-center py-4 text-muted">
          No {activeTab === 'all' ? 'pets' : activeTab} found.
        </div>
      )}
    </div>
  );
};

export default PetSearch;