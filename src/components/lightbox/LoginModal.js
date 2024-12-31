import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export default function LoginModal({ showLoginPrompt, handleLoginRedirect, message="You need to login to continue."}) {
  return (
    <Modal isOpen={showLoginPrompt}>
      <ModalHeader>Login Required</ModalHeader>
      <ModalBody>
        <p>{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleLoginRedirect}>
          Log In
        </Button>
      </ModalFooter>
    </Modal>
  )
}