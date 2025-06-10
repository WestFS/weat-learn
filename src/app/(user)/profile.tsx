import React, { useState } from "react";
import { StyleSheet, Pressable, Modal, ActivityIndicator } from "react-native";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  Text as ThemedText,
  View as ThemedView,
} from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/components/useColorScheme";

export default function ProfileScreen() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const colorScheme = useColorScheme() ?? "light";

  const handleConfirmSignOut = () => {
    signOut();
    setModalOpen(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={styles.profileContainer}
        lightColor="rgba(255, 255, 255, 0.9)"
        darkColor="rgba(50, 30, 70, 0.5)"
      >
        <ThemedText style={styles.profileTitle}>
          Perfil de {user?.name}
        </ThemedText>
        <ThemedText style={styles.profileEmail}>
          Email: {user?.email}
        </ThemedText>
        <ThemedView
          style={styles.separator}
          lightColor="#e0e0e0"
          darkColor="rgba(255, 255, 255, 0.15)"
        />

        <Pressable
          style={styles.signOutButton}
          onPress={() => setModalOpen(true)}
        >
          <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
        </Pressable>
      </ThemedView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView
            style={[
              styles.modalContent,
              { backgroundColor: Colors[colorScheme].background },
            ]}
          >
            <ThemedText style={styles.modalTitle}>
              Confirmar Sign Out
            </ThemedText>
            <ThemedText style={styles.modalText}>
              Você tem certeza que deseja sair?
            </ThemedText>
            <ThemedView style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalOpen(false)}
              >
                <ThemedText style={styles.cancelButtonText}>
                  Cancelar
                </ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmSignOut}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.confirmButtonText}>
                    Sim, Sair
                  </ThemedText>
                )}
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    width: "100%",
    marginVertical: 20,
  },
  signOutButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 5,
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 350,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#555",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#d32f2f",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
