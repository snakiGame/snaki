import { Button, Text, View, StyleSheet } from "react-native";
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
