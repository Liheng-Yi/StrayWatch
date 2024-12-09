import React, { useState, useEffect } from 'react';
import { Pet } from './clients';

interface PetUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (petId: string, data: FormData) => void;
  pet: Pet | null;
}

const PetUpdateModal: React.FC<PetUpdateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  pet
}) => {
  const [formData, setFormData] = useState<Partial<Pet>>({
    name: '',
    kind: '',
    color: '',
    location: '',
    description: '',
    status: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        kind: pet.kind,
        color: pet.color,
        location: pet.location,
        description: pet.description,
        status: pet.status
      });
    }
  }, [pet]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pet) {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      onSubmit(pet._id, submitData);
    }
  };

  if (!isOpen || !pet) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Pet Information</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.kind}
                  onChange={e => setFormData({...formData, kind: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Pet Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {(previewUrl || pet?.picture) && (
                  <img 
                    src={previewUrl || pet?.picture} 
                    alt="Pet preview" 
                    className="mt-2"
                    style={{ maxWidth: '200px' }}
                  />
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Pet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetUpdateModal; 