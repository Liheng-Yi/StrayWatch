import React, { useState, useEffect } from 'react';
import { PetClient, Pet } from './clients';
import { useParams, useNavigate } from 'react-router-dom';
import ContactModal, { ContactFormData } from '../../Components/util/Contact';

interface PetDetailsProps {}

const PetDetails: React.FC<PetDetailsProps> = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactSubmit = (formData: ContactFormData) => {
    console.log('Contact form submitted:', formData);
    // Here you would typically send this data to your backend
    alert('Message sent! The owner will contact you soon.');
  };

  useEffect(() => {
    const fetchPetDetails = async () => {
      if (!petId) {
        setError('No pet ID provided');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await PetClient.fetchPetById(petId);
        setPet(data);
      } catch (err) {
        console.error("Error fetching pet:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetDetails();
  }, [petId]);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  if (isLoading) {
    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center p-4">
              <div className="text-danger">{error}</div>
              <button className="btn btn-secondary mt-3" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">Pet Details</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Image Column */}
              <div className="col-md-6">
                <div className="position-relative">
                  <img
                    src={pet?.picture || "/api/placeholder/400/320"}
                    alt={pet?.name}
                    className="img-fluid rounded shadow-sm"
                    style={{ 
                      width: '100%', 
                      height: '300px', 
                      objectFit: 'cover' 
                    }}
                  />
                  <span className={`position-absolute top-0 end-0 m-2 badge ${
                    pet?.status === 'Lost' ? 'bg-danger' : 'bg-success'
                  } rounded-pill`}>
                    {pet?.status}
                  </span>
                </div>
              </div>
              
              {/* Details Column */}
              <div className="col-md-6">
                <h3 className="mb-3 fw-bold">{pet?.name}</h3>
                
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <dl className="row mb-0">
                      <dt className="col-sm-4 text-muted">Type</dt>
                      <dd className="col-sm-8">{pet?.kind}</dd>
                      
                      <dt className="col-sm-4 text-muted">Color</dt>
                      <dd className="col-sm-8">{pet?.color}</dd>
                      
                      <dt className="col-sm-4 text-muted">Location</dt>
                      <dd className="col-sm-8">{pet?.location}</dd>
                      
                      <dt className="col-sm-4 text-muted">Description</dt>
                      <dd className="col-sm-8">{pet?.description}</dd>
                      
                      {pet?.createdAt && (
                        <>
                          <dt className="col-sm-4 text-muted">Posted</dt>
                          <dd className="col-sm-8">
                            {new Date(pet.createdAt).toLocaleDateString()} {new Date(pet.createdAt).toLocaleTimeString()}
                          </dd>
                        </>
                      )}

                    </dl>
                  </div>
                </div>

                {pet?.lat && pet?.lng && (
                  <div className="mt-3">
                    <a 
                      href={`https://www.google.com/maps?q=${pet.lat},${pet.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-purple w-100"
                      style={{
                        borderColor: '#8B5CF6',
                        color: '#8B5CF6',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#8B5CF6';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#8B5CF6';
                      }}
                    >
                      <i className="bi bi-geo-alt me-2"></i>
                      View on Map
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-footer border-top">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: '#8B5CF6',
                color: 'white',
              }}
              onClick={() => navigate(`/profile/${pet?.userId}`)}
            >
              Contact Owner
            </button>
          </div>
        </div>
      </div>
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        petName={pet?.name || ''}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
};

export default PetDetails;
