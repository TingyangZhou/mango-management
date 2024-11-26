import { useModal } from '../../context/Modal';
import './OpenModalButton.css'

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  className,
  modalClass,
}) {
    const { setModalContent, setOnModalClose, setModalClass } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    if (modalClass) setModalClass(modalClass);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <button className={className} onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
