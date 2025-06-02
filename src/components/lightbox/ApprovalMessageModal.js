import React from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

// Lightbox component for accepting approval messages
const ApprovalMessageModal = ({ isOpen, toggle, message, setMessage, onSubmit, eventId }) => {
  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(eventId, message);
      setMessage('');
      toggle();
    } else {
      alert("Please enter a message before submitting.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Approval Message</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <label htmlFor="approvalMessage" className="form-label">Message:</label>
          <textarea
            id="approvalMessage"
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            placeholder="Enter your message here..."
          />
        </div>
        <div className="d-flex justify-content-end">
          <Button color="primary" onClick={handleSubmit}>Submit</Button>
          <Button color="secondary" className="ms-2" onClick={toggle}>Cancel</Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ApprovalMessageModal;