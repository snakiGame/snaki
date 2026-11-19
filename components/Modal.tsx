import Modal from "react-native-modal";

interface ModalProps {
  children: React.ReactNode;
  isModalVisible: boolean;
  toggleModal: () => void;
}

export default function ModalComponent({children,isModalVisible}:ModalProps) {
  return (
    <Modal
      isVisible={isModalVisible}
      // onBackdropPress={toggleModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      {children}
    </Modal>
  );
}
