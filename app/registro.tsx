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
      body: JSON.stringify({ nombre, correo, contrasena, direccion, telefono }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "No se pudo registrar");

    // ✅ Mensaje de éxito
    if (typeof window !== "undefined") {
      // WEB
      window.alert("¡Bienvenido! 🎉 Tu cuenta se ha creado exitosamente");
      router.replace("/cliente");
    } else {
      // MÓVIL
      Alert.alert(
        "¡Bienvenido! 🎉",
        "Tu cuenta se ha creado exitosamente",
        [
          {
            text: "OK",
            onPress: () => router.replace("/cliente"),
          },
        ],
        { cancelable: false }
      );
    }

  } catch (e: any) {
    setErr(e?.message || "Error al registrar cliente");
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.card}>
          <View style={s.header}>
            <Text style={s.title}>Crear Cuenta</Text>
            <Text style={s.subtitle}>Únete a nuestra comunidad</Text>
          </View>

          <View style={s.form}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Nombre completo</Text>
              <TextInput
                style={s.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Tu nombre completo"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>Correo electrónico</Text>
              <TextInput
                style={s.input}
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#94a3b8"
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
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>Dirección</Text>
              <TextInput
                style={s.input}
                value={direccion}
                onChangeText={setDireccion}
                placeholder="Tu dirección completa"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>
                Teléfono <Text style={s.optional}>(opcional)</Text>
              </Text>
              <TextInput
                style={s.input}
                value={telefono}
                onChangeText={setTelefono}
                placeholder="+52 123 456 7890"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
              />
            </View>

            {err ? (
              <View style={s.errorContainer}>
                <Text style={s.errorIcon}>⚠️</Text>
                <Text style={s.error}>{err}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={onRegistrar}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={s.btnText}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.linkButton}
              onPress={() => router.replace("/login")}  // Cambiado de "/" a "/login"
            >
              <Text style={s.linkText}>
                ¿Ya tienes cuenta? <Text style={s.linkTextBold}>Iniciar sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb" },
  scrollContent: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: { alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "800", color: "#0f172a", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#64748b", fontWeight: "500" },
  form: { width: "100%" },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginBottom: 6 },
  optional: { fontSize: 12, fontWeight: "400", color: "#94a3b8" },
  input: {
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  errorContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fef2f2", borderRadius: 8, padding: 10, marginBottom: 14, borderLeftWidth: 3, borderLeftColor: "#ef4444" },
  errorIcon: { marginRight: 6, fontSize: 14 },
  error: { color: "#dc2626", fontSize: 13, fontWeight: "600", flex: 1 },
  btn: { borderRadius: 8, marginBottom: 14, backgroundColor: "#0f172a", paddingVertical: 14, alignItems: "center" },
  btnDisabled: { backgroundColor: "#64748b", opacity: 0.7 },
  btnText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  linkButton: { alignItems: "center", paddingVertical: 10 },
  linkText: { fontSize: 13, color: "#64748b" },
  linkTextBold: { fontWeight: "700", color: "#0f172a" },
});
