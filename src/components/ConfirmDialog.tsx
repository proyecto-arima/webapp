import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface ConfirmDialogProps {
  isOpen: boolean;
  toggle: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, toggle, onConfirm, onCancel, message }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Confirmación</ModalHeader>
      <ModalBody>
        {message}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onConfirm}>Sí</Button>{' '}
        <Button color="secondary" onClick={onCancel}>No</Button>
      </ModalFooter>
    </Modal>
  );
};
