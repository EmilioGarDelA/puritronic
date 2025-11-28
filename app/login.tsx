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
import React from "react";

const API_URL = Platform.OS === "web"
  ? "http://localhost:4000"
  : "http://10.0.2.2:4000";

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
      if (!correo || !contrasena) throw new Error("Ingresa correo y contraseña");

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          correo: correo.toLowerCase().trim(),
          contrasena,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Credenciales inválidas");

      await setToken(data.token);
      await saveUser({ id: data.user.id, nombre: data.user.nombre });

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
          [{ text: "OK", onPress: () => router.replace(destino as any) }]
        );
      }
    } catch (e: any) {
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
            <View style={s.errorBox}>
              <Text style={s.errorIcon}>⚠️</Text>
              <Text style={s.errorText}>{err}</Text>
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

          {/* BOTONES PRINCIPALES */}
          <View style={s.btnRow}>
            {/* REGRESAR */}
            <TouchableOpacity
              style={[s.btn, s.btnBack]}
              onPress={() => router.replace("/")}
            >
              <Text style={[s.btnText, { color: "#0d4fa1" }]}>Regresar</Text>
            </TouchableOpacity>

            {/* LOGIN */}
            <TouchableOpacity
              style={[s.btn, s.btnLogin, loading && s.btnDisabled]}
              onPress={onLogin}
              disabled={loading}
            >
              <Text style={s.btnText}>
                {loading ? "..." : "Iniciar Sesión"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* IR A REGISTRO */}
          <TouchableOpacity
            style={s.linkButton}
            onPress={() => router.replace("/registro")}
          >
            <Text style={s.link}>
              ¿No tienes cuenta?{" "}
              <Text style={s.linkBold}>Regístrate aquí</Text>
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
    backgroundColor: "#8caffbff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22,
    width: "100%",
    maxWidth: 360,
    borderWidth: 2,
    borderColor: "#0d4fa120",
    shadowColor: "#0d4fa1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },

  header: { alignItems: "center", marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0d4fa1",
  },
  subtitle: {
    fontSize: 16,
    color: "#ff4d4f",
    fontWeight: "600",
    marginTop: 3,
  },

  form: { width: "100%" },
  inputGroup: { marginBottom: 16 },

  label: {
    fontSize: 14,
    color: "#0d4fa1",
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#f1f5f9",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#0f172a",
  },

  /* ERROR */
  errorBox: {
    flexDirection: "row",
    backgroundColor: "#ffe5e5",
    borderLeftWidth: 4,
    borderLeftColor: "#ff4d4f",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  errorIcon: { fontSize: 16, marginRight: 6 },
  errorText: { color: "#b91c1c", fontWeight: "700", fontSize: 13 },

  /* BOTONES */
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  btnBack: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#0d4fa1",
  },

  btnLogin: { backgroundColor: "#0d4fa1" },
  btnDisabled: { opacity: 0.6 },

  btnText: { color: "#fff", fontWeight: "800", fontSize: 15 },

  linkButton: { alignItems: "center", marginTop: 15 },
  link: { color: "#64748b", fontSize: 13 },
  linkBold: { color: "#0d4fa1", fontWeight: "800" },
});
