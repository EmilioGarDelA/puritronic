import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { setToken, saveUser } from "../utils/authStorage";

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:4000'
  : 'http://10.0.2.2:4000'; // Para Android emulator

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

 const onLogin = async () => {
  setErr(null);
  setLoading(true);

  try {
    if (!correo || !contrasena) {
      throw new Error("Ingresa correo y contraseña");
    }

    console.log('Intentando login con:', { correo });

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        correo: correo.toLowerCase().trim(), 
        contrasena 
      }),
    });

    const data = await res.json();
    console.log('Respuesta del servidor:', data);

    if (!res.ok) {
      throw new Error(data?.error || "Credenciales inválidas");
    }

    if (!data.token || !data.user) {
      throw new Error("Respuesta del servidor incompleta");
    }

    // Guardar token y datos del usuario
    await setToken(data.token);
    await saveUser({
      id: data.user.id,
      nombre: data.user.nombre,
    });

    // ✅ Redirección según el rol
    const destino =
      data.user.rol === "admin"
        ? "/admin"
        : data.user.rol === "empleado"
        ? "/empleado"
        : data.user.rol === "repartidor"
        ? "/repartidor"
        : "/cliente";

    if (Platform.OS === "web") {
      window.alert(`¡Bienvenido, ${data.user.nombre}! 🎉`);
      router.replace(destino as any);
    } else {
      Alert.alert(
        "¡Bienvenido! 🎉",
        `Inicio de sesión exitoso como ${data.user.rol}`,
        [{ text: "OK", onPress: () => router.replace(destino as any) }],
        { cancelable: false }
      );
    }

  } catch (e: any) {
    console.error('Error durante login:', e);
    setErr(e?.message || "Error al iniciar sesión");
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={s.container}>
      <View style={s.card}>
        <View style={s.header}>
          <Text style={s.title}>Iniciar Sesión</Text>
          <Text style={s.subtitle}>Bienvenido de vuelta</Text>
        </View>

        <View style={s.form}>
          {err && (
            <View style={s.errorContainer}>
              <Text style={s.errorIcon}>⚠️</Text>
              <Text style={s.error}>{err}</Text>
            </View>
          )}

          <View style={s.inputGroup}>
            <Text style={s.label}>Correo electrónico</Text>
            <TextInput
              style={s.input}
              value={correo}
              onChangeText={setCorreo}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Contraseña</Text>
            <TextInput
              style={s.input}
              value={contrasena}
              onChangeText={setContrasena}
              placeholder="Tu contraseña"
              placeholderTextColor="#94a3b8"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[s.btn, loading && s.btnDisabled]}
            onPress={onLogin}
            disabled={loading}
          >
            <Text style={s.btnText}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.linkButton}
            onPress={() => router.replace("/registro")}
          >
            <Text style={s.linkText}>
              ¿No tienes cuenta?{" "}
              <Text style={s.linkTextBold}>Regístrate aquí</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
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
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#ef4444",
  },
  errorIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  btn: {
    borderRadius: 8,
    marginBottom: 14,
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: "#64748b",
    opacity: 0.7,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 13,
    color: "#64748b",
  },
  linkTextBold: {
    fontWeight: "700",
    color: "#0f172a",
  },
});