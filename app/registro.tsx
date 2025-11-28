// app/cliente/registro.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import fondo from "../assets/images/fondo.jpg";
import React from "react";

const API_URL = "http://localhost:4000";

export default function RegistroCliente() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onRegistrar = async () => {
    setErr(null);
    setLoading(true);

    try {
      if (!nombre || !correo || !contrasena || !direccion) {
        throw new Error("Completa todos los campos");
      }

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo,
          contrasena,
          direccion,
          telefono,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo registrar");

      if (typeof window !== "undefined") {
        window.alert("Cuenta creada correctamente");
        router.replace("/cliente");
      } else {
        Alert.alert("Registro exitoso", "Tu cuenta fue creada", [
          { text: "OK", onPress: () => router.replace("/cliente") },
        ]);
      }
    } catch (e: any) {
      setErr(e?.message || "Error al registrar cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
  source={fondo}
  style={s.bg}
  imageStyle={s.bgImage}  // 🔥 importante
>

     
      {/* BOTÓN REGRESAR */}
      <TouchableOpacity style={s.backButton} onPress={() => router.push("/")}>
        <Ionicons name="arrow-back" size={28} color="#ffffff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.scrollContent}>
        <View style={s.card}>
          <View style={s.header}>
            <Text style={s.title}>Registrar Cliente</Text>
          </View>

          <View style={s.form}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Nombre completo</Text>
              <TextInput
                style={s.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre del cliente"
                placeholderTextColor="#8fa3b0"
              />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>Correo electrónico</Text>
              <TextInput
                style={s.input}
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#8fa3b0"
                autoCapitalize="none"
              />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>Contraseña</Text>
              <TextInput
                style={s.input}
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#8fa3b0"
              />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>Dirección</Text>
              <TextInput
                style={s.input}
                value={direccion}
                onChangeText={setDireccion}
                placeholder="Dirección completa"
                placeholderTextColor="#8fa3b0"
              />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>Teléfono (opcional)</Text>
              <TextInput
                style={s.input}
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
                placeholder="123 456 7890"
                placeholderTextColor="#8fa3b0"
              />
            </View>

            {err && (
              <View style={s.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#b91c1c" />
                <Text style={s.error}>{err}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={onRegistrar}
              disabled={loading}
            >
              <Text style={s.btnText}>
                {loading ? "Creando..." : "Registrar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.linkButton}
              onPress={() => router.replace("/login")}
            >
              <Text style={s.linkText}>
                ¿Ya tienes cuenta?{" "}
                <Text style={s.linkTextBold}>Iniciar sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>

  );
}

const s = StyleSheet.create({
  

  bgImage: {
  width: "120%",   // hazla más o menos grande
  height: "120%",  // puedes bajar a 120% si la quieres más compacta
  alignSelf: "center",
},



  container: {
    flex: 1,
    backgroundColor: "#1d4e89",
  },

  backButton: {
    position: "absolute",
    top: 45,
    left: 18,
    zIndex: 20,
    padding: 4,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    paddingTop: 80,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: 340,        // más pequeño
    elevation: 3,
  },

  header: { alignItems: "center", marginBottom: 10 },

  title: {
    fontSize: 20,         // más pequeño
    fontWeight: "800",
    color: "#1d4e89",
  },

  form: { width: "100%" },

  inputGroup: {
    marginBottom: 10,     // reduje separación
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },

  input: {
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cfd9e0",
    paddingVertical: 8,    // antes 12 → compacto
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#0f172a",
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    gap: 6,
  },

  error: {
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: "600",
  },

  btn: {
    borderRadius: 8,
    backgroundImage: "#1d4e89",
    paddingVertical: 12,    // antes 14
    alignItems: "center",
    marginTop: 5,
  },

  btnDisabled: { opacity: 0.6 },

  btnText: {
    color: "#ffffff",
    fontSize: 15,           // antes 16
    fontWeight: "800",
  },

  linkButton: { alignItems: "center", marginTop: 10 },

  linkText: { fontSize: 13, color: "#6b7280" },

  linkTextBold: { fontWeight: "700", color: "#1d4e89" },
});
