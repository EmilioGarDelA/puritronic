import * as React from "react";
import { useState } from "react";
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
import { WebView } from "react-native-webview";


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
  const [openMapa, setOpenMapa] = useState(false);


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
      

      {/* Contenido */}
      <ScrollView contentContainerStyle={s.body}>
        <View style={s.appbar}>
        <View style={{ width: 50 }} /> {/* espacio fantasma para centrar el título */}
        <Text style={s.appTitle}>CLIENTE</Text>
        <TouchableOpacity
          style={s.appBtn}
          onPress={() => router.push("/")}
>
          <Ionicons name="home-outline" size={18} color="#fff" />
          <Text style={s.appBtnTx}>Inicio</Text>
        </TouchableOpacity>
      </View>

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
  setOpenMapa(true); // abre el mapa DIRECTO
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
      {/* Modal - Ver Mapa */}
<Modal
  visible={openMapa}
  animationType="slide"
  transparent
  onRequestClose={() => setOpenMapa(false)}
>
  <View style={s.modalWrap}>
    <View style={[s.modalCard, { height: "80%" }]}>
      
      {/* Header */}
      <View style={s.modalHeader}>
        <Text style={s.modalTitle}>Ubicación de la purificadora</Text>
        <TouchableOpacity onPress={() => setOpenMapa(false)}>
          <Ionicons name="close" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* Mapa */}
            <View style={s.mapContainer}>
              <Text style={s.mapTitle}>📍 Rango de entrega (5 km)</Text>
      
              {Platform.OS === "web" ? (
                <iframe
                  src="https://www.google.com/maps?q=L%C3%A1zaro+C%C3%A1rdenas+503,+Pabell%C3%B3n+de+Arteaga,+Ags.&z=14&output=embed"
                  style={s.webMap as any}
                  loading="lazy"
                />
              ) : (
                <WebView
                  source={{
                    html: `
                      <iframe
                        width="100%"
                        height="100%"
                        style="border:0"
                        loading="lazy"
                        allowfullscreen
                        referrerpolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps?q=L%C3%A1zaro+C%C3%A1rdenas+503,+Pabell%C3%B3n+de+Arteaga,+Ags.&z=14&output=embed">
                      </iframe>
                    `,
                  }}
                  style={s.map}
                />
              )}
            </View>
    </View>
  </View>
</Modal>

    </View>
    
  );
}

const s = StyleSheet.create({

  map: {
    width: "100%",
    height: 300,
  },

  webMap: {
    width: "100%",
    height: "300px",
    border: "none",
  },

  mapTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0d4fa1",
    padding: 10,
    textAlign: "center",
  },
  screen: {
    flex: 1,
    backgroundColor: "#eef2f6",
  },

  /* ---------- APP BAR ---------- */
  appbar: {
    paddingTop: 38,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: "#0f172a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  appTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  appBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  appBtnTx: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "700",
    fontSize: 13,
  },

  /* ---------- BODY ---------- */
  body: {
    padding: 16,
    gap: 16,
    paddingBottom: 120,
  },

  /* ---------- GRID ---------- */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "space-between",
  },

  tile: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,

    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  tileIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#e3e8ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  tileTitle: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#0f172a",
  },
  tileSub: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    lineHeight: 15,
  },

  /* ---------- CARD ---------- */
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardH: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0f172a",
  },
  cardP: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 18,
  },
  linkBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#0f172a",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  linkBtnTx: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13.5,
  },

  /* ---------- MODAL ---------- */
  modalWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalCard: {
    width: "88%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    gap: 12,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0f172a",
  },

  /* ---------- FORM ---------- */
  label: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1.2,
    borderColor: "#dbe1ea",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14.5,
    color: "#0f172a",
  },

  /* ---------- ERROR ---------- */
  error: {
    marginTop: 5,
    color: "#dc2626",
    fontWeight: "700",
    fontSize: 12.5,
  },

  /* ---------- BUTTON ---------- */
  primaryBtn: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnTx: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  btnDisabled: {
    opacity: 0.55,
  },
});

