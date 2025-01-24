import { Button, Text, View, StyleSheet } from "react-native";
import Modal from "react-native-modal";

interface ModalProps {
  children: React.ReactNode;
  isModalVisible: boolean;
  toggleModal: () => void;
}

export default function Modal() {
  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={toggleModal} // Close modal when tapping outside
      animationIn="slideInUp" // Custom animation for showing the modal
      animationOut="slideOutDown" // Custom animation for hiding the modal
    >
      {children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});
