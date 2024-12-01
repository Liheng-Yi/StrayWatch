import React, { useState } from 'react';
import PurpleButton from '../UI/lightPurpleButton';
import { FaUser, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  onSubmit: (formData: ContactFormData) => void;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ 
  isOpen, 
  onClose, 
  petName,
  onSubmit 
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', phone: '', message: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title fw-bold">{petName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body px-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 position-relative">
                <label htmlFor="name" className="form-label">Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaUser className="text-secondary" />
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-start-0 ps-0" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaEnvelope className="text-secondary" />
                  </span>
                  <input 
                    type="email" 
                    className="form-control border-start-0 ps-0" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="form-label">Phone</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaPhone className="text-secondary" />
                  </span>
                  <input 
                    type="tel" 
                    className="form-control border-start-0 ps-0" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="form-label">Message</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaComment className="text-secondary" />
                  </span>
                  <textarea 
                    className="form-control border-start-0 ps-0" 
                    id="message" 
                    name="message" 
                    rows={3} 
                    value={formData.message} 
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="text-center mt-4 mb-3">
                <PurpleButton type="submit" style={{ minWidth: '150px' }}>
                  Send Message
                </PurpleButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
