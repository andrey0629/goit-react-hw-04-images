import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Overlay, ModalWindow, ModalImg } from './Modal.styled';

export function Modal({ largeImg, onClose }) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeydownCloseModal);
    return () => {
      window.removeEventListener('keydown', handleKeydownCloseModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeydownCloseModal = evt => {
    if (evt.code === 'Escape') {
      onClose();
    }
  };

  const handleClickMouseCloseModal = evt => {
    if (evt.currentTarget === evt.target) {
      onClose();
    }
  };
  return (
    <Overlay onClick={handleClickMouseCloseModal}>
      <ModalWindow>
        <ModalImg src={largeImg} alt="" />
      </ModalWindow>
    </Overlay>
  );
}
Modal.propTypes = {
  largeImg: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
