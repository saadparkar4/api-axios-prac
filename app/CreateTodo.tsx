import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createTodo } from "../services/api";

export default function CreateTodo() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState("1"); // Default userId
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = title.trim().length > 0 && userId.trim().length > 0;

  const handleCreateTodo = async () => {
    if (!isFormValid) {
      setError("Please enter a title and user ID");
      return;
    }

    const userIdNumber = parseInt(userId, 10);
    if (isNaN(userIdNumber)) {
      setError("User ID must be a number");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newTodo = {
        title: title.trim(),
        completed,
        userId: userIdNumber,
      };

      const result = await createTodo(newTodo);

      if (result) {
        Alert.alert(
          "Success",
          `Todo created successfully with ID: ${result.id}`,
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        setError("Failed to create todo");
      }
    } catch (err) {
      setError("An error occurred while creating the todo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Create New Todo</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter todo title"
              maxLength={100}
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>User ID:</Text>
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              placeholder="Enter user ID"
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Completed:</Text>
            <Switch
              value={completed}
              onValueChange={setCompleted}
              trackColor={{ false: "#ddd", true: "#81b0ff" }}
              thumbColor={completed ? "#3498db" : "#f4f3f4"}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.createButton,
                !isFormValid && styles.disabledButton,
              ]}
              onPress={handleCreateTodo}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Create Todo</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#95a5a6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    backgroundColor: "#3498db",
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
