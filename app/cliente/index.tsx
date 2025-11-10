import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { removeToken, getUserId, getToken } from "../../utils/authStorage"; // 🔐 limpia token web/móvil


const API_URL =
  Platform.OS === "web"
    ? "http://localhost:4000" // Navegador (React Web)
    : "http://10.0.2.2:4000"; // Emulador Android


// Simple ActionTile component definition
type ActionTileProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
};

const ActionTile: React.FC<ActionTileProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={s.tile} onPress={onPress}>
    <View style={s.tileIcon}>{icon}</View>
    <Text style={s.tileTitle}>{title}</Text>
    <Text style={s.tileSub}>{subtitle}</Text>
  </TouchableOpacity>
);

export default function ClienteHome() {
  const router = useRouter();
  const [openNueva, setOpenNueva] = useState(false);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  

  const onLogout = async () => {
    await removeToken();
    router.replace("/");
  };

const fetchDireccionCliente = async () => {
  try {
    const t = token || (await getToken()); // usa el token del estado o lo carga
    if (!t) throw new Error("No hay usuario logueado");

    const res = await fetch(`${API_URL}/api/clientes/me`, {
      headers: { Authorization: `Bearer ${t}` }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "No se pudo obtener dirección");

    setDireccion(data.direccion);
    setNombre(data.nombre);
  } catch (error: any) {
    console.error("Error al obtener dirección:", error.message);
    setDireccion("");
  }
};



const [token, setToken] = useState<string | null>(null);



  const onNuevaCompra = async () => {
  setErr(null);

  if (!nombre.trim() || !cantidad.trim()) {
    setErr("Completa nombre y cantidad");
    return;
  }

  const cantN = Number(cantidad);
  if (!Number.isFinite(cantN) || cantN <= 0) {
    setErr("La cantidad debe ser un número mayor a 0");
    return;
  }

  try {
    setLoading(true);

    const token = await getToken(); // 🔑 Obtener token JWT
    if (!token) throw new Error("No hay usuario logueado");

    const res = await fetch(`${API_URL}/api/venta`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // ✅ enviar token
      },
      body: JSON.stringify({
        canal: "domicilio",
        items: [
          { producto_id: 1, cantidad: cantN, precio_unitario: 25.0 },
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Error al registrar pedido");

    setOpenNueva(false);
    setNombre("");
    setDireccion("");
    setCantidad("1");
    Alert.alert("Pedido creado", `Tu pedido #${data.venta_id} fue registrado.`);
  } catch (e: any) {
    setErr(e?.message || "No se pudo crear el pedido");
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={s.screen}>
      {/* AppBar */}
      <View style={s.appbar}>
        <Text style={s.appTitle}>Cliente</Text>
        <TouchableOpacity onPress={onLogout} style={s.appBtn}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={s.appBtnTx}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView contentContainerStyle={s.body}>
        <Text style={s.h}>Principal</Text>

        {/* Acciones rápidas (grid 2x) */}
        <View style={s.grid}>
          <ActionTile
            icon={<MaterialCommunityIcons name="cart-plus" size={24} color="#0f172a" />}
            title="Nueva compra"
            subtitle="Nombre, dirección y cantidad"
            onPress={() => {
            fetchDireccionCliente();
            setOpenNueva(true);
          }}
          />
          <ActionTile
            icon={<Ionicons name="list-outline" size={24} color="#0f172a" />}
            title="Mis pedidos"
            subtitle="Historial y estados"
            onPress={() => router.push("/cliente/pedidos")} // crea esta ruta cuando gustes
          />
          <ActionTile
            icon={<Ionicons name="map-outline" size={24} color="#0f172a" />}
            title="Ver en mapa"
            subtitle="Ubicación de entrega"
            onPress={() => {
              if (!direccion) {
                return Alert.alert("Sin dirección", "Primero ingresa una dirección en 'Nueva compra'.");
              }
              router.push("/registro");
            }}
          />
        </View>

        {/* Instrucciones */}
        <View style={s.card}>
          <Text style={s.cardH}>¿Cómo hacer un pedido?</Text>
          <Text style={s.cardP}>
            1. Ingresa el nombre del producto y la cantidad deseada.
          </Text>
          <Text style={s.cardP}>
            2. Proporciona una dirección de entrega válida.
          </Text>
          <Text style={s.cardP}>
            3. Confirma tu pedido y espera la llegada de tu compra.
          </Text>
          <TouchableOpacity
            onPress={() => setOpenNueva(true)}
            style={s.linkBtn}
          >
            <Text style={s.linkBtnTx}>¡Haz tu primer pedido ahora!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal - Nueva compra */}
      <Modal
        visible={openNueva}
        animationType="slide"
        transparent
        onRequestClose={() => setOpenNueva(false)}
      >
        <View style={s.modalWrap}>
          <View style={s.modalCard}>
            {/* Header */}
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Nueva compra</Text>
              <TouchableOpacity onPress={() => setOpenNueva(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            {/* Formulario */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%" }}
            >
              <Text style={s.label}>Nombre del producto</Text>
              <TextInput
                value={nombre}
                onChangeText={setNombre}
                style={s.input}
                placeholder="Ej. Garrafón"
                placeholderTextColor="#94a3b8"
              />
              <Text style={s.label}>Cantidad</Text>
              <TextInput
                value={cantidad}
                onChangeText={setCantidad}
                style={s.input}
                placeholder="Ej. 2"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
              />
              <Text style={s.label}>Dirección de entrega</Text>
              <TextInput
                value={direccion}
                onChangeText={setDireccion}
                style={s.input}
                placeholder="Ej. Av. Siempre Viva 742"
                placeholderTextColor="#94a3b8"
              />

              {err && <Text style={s.error}>{err}</Text>}

              <TouchableOpacity
                onPress={onNuevaCompra}
                style={[s.primaryBtn, loading && s.btnDisabled]}
                disabled={loading}
              >
                <Text style={s.primaryBtnTx}>
                  {loading ? "Registrando..." : "Registrar pedido"}
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f9fafb" },
  appbar: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#0f172a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  appBtn: { flexDirection: "row", alignItems: "center" },
  appBtnTx: { color: "#fff", marginLeft: 4 },

  body: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  h: { fontSize: 22, fontWeight: "800", color: "#111827", marginBottom: 16 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },

  tile: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    gap: 12,
  },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  tileTitle: { fontSize: 15, fontWeight: "800", color: "#0f172a" },
  tileSub: { fontSize: 12, color: "#64748b", marginTop: 2 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    gap: 8,
  },
  cardH: { fontWeight: "800", color: "#111827", fontSize: 15 },
  cardP: { color: "#334155", fontSize: 13, lineHeight: 18 },
  linkBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#0f172a",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  linkBtnTx: { color: "#fff", fontWeight: "700" },

  // Modal
  modalWrap: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    gap: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  modalTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginTop: 6,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#0f172a",
  },
  error: { marginTop: 6, color: "#b91c1c", fontWeight: "700" },

  primaryBtn: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnTx: { color: "#fff", fontWeight: "700" },
  btnDisabled: { opacity: 0.7 },
});
