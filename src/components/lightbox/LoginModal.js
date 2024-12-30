import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export default function LoginModal({ showLoginPrompt, handleLoginRedirect}) {
  return (
    <Modal isOpen={showLoginPrompt}>
      <ModalHeader>Login Required</ModalHeader>
      <ModalBody>
        <p>You need to log in to complete this reservation.</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleLoginRedirect}>
          Log In
        </Button>
      </ModalFooter>
    </Modal>
  )
}