// app/(tabs)/index.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { setToken } from "../../utils/authStorage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:4000";

export default function BienvenidaLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onLogin = async () => {
    setErr(null);
    setLoading(true);

    try {
      if (!email || !pass) throw new Error("Ingresa email y contraseña");

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email.trim(), contrasena: pass }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo iniciar sesión");

      // 🔐 Guarda token
      await setToken(data.token);

      // Redirige según rol
      const rol: string = data.user.rol;
      if (rol === "admin") router.replace("/admin");
      else if (rol === "empleado") router.replace("/empleado");
      else router.replace("/cliente");
    } catch (e: any) {
      setErr(e?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={["#4FC3F7", "#29B6F6", "#0288D1"]}
        style={s.backgroundGradient}
      />

      {/* Elementos decorativos en cuadrícula */}
      <View style={s.backgroundElements}>
        {[
          s.waterDrop,
          s.bubble,
          s.wave,
          s.waterDrop,
          s.bubble,
          s.wave,
          s.waterDrop,
          s.bubble,
          s.wave,
          s.waterDrop,
          s.bubble,
          s.wave,
        ].map((style, i) => (
          <View key={i} style={s.cell}>
            <View style={style} />
          </View>
        ))}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={s.keyboardView}
      >
        <View style={s.content}>
          <Text style={s.title}>Bienvenido a Puritronic Digital🚰</Text>

          <View style={s.card}>
            <Text style={s.h2}>Iniciar sesión</Text>

            <Text style={s.label}>Email</Text>
            <TextInput
              placeholder="tu@correo.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={s.inp}
              placeholderTextColor="#9aa3b2"
            />

            <Text style={s.label}>Contraseña</Text>
            <TextInput
              placeholder="••••••••"
              value={pass}
              onChangeText={setPass}
              secureTextEntry
              style={s.inp}
              placeholderTextColor="#9aa3b2"
            />

            {err ? <Text style={s.error}>{err}</Text> : null}

            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={onLogin}
              disabled={loading}
            >
              <Text style={s.btnTx}>
                {loading ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>

            {/* 🔗 Link a registro */}
            <TouchableOpacity
              onPress={() => router.push("/registro")}
              style={s.registerLink}
            >
              <Text style={s.registerText}>
                ¿No tienes cuenta? Crear cuenta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cell: {
    width: "25%", // 4 columnas
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  waterDrop: {
    backgroundColor: "#ffffff",
    opacity: 0.15,
    borderRadius: 50,
    width: "80%",
    height: "80%",
  },
  bubble: {
    backgroundColor: "#ffffff",
    opacity: 0.1,
    borderRadius: 50,
    width: "60%",
    height: "60%",
  },
  wave: {
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 100,
    opacity: 0.1,
    width: "90%",
    height: "90%",
  },
  keyboardView: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 30,
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: "#e0f2fe",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    width: "90%",
    maxWidth: 360,
    alignSelf: "center",
  },
  h2: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginTop: 15,
    marginBottom: 8,
  },
  inp: {
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#0f172a",
    backgroundColor: "#ffffff",
  },
  error: {
    marginTop: 10,
    color: "#ef4444",
    fontWeight: "600",
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  btnDisabled: { opacity: 0.7 },
  btnTx: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  registerLink: {
    marginTop: 15,
    alignSelf: "center",
    padding: 5,
  },
  registerText: {
    color: "#0f172a",
    fontWeight: "600",
    fontSize: 14,
  },
});