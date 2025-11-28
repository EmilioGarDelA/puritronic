import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";

type Venta = {
  id: number;
  codigo: string;
  canal: string;
  estado: "Entregado" | "Pendiente";
  nombre_cliente: string;
  direccion: string;
  producto: string;
  cantidad: number;
  total: number;
  creado_en: string;
};

export default function EmpleadoPedidos() {
  const [pedidos, setPedidos] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fakeVentas: Venta[] = [
      {
        id: 17,
        codigo: "V003",
        canal: "Sucursal",
        estado: "Entregado",
        nombre_cliente: "María López",
        direccion: "Av. Central 12",
        producto: "Garrafón 20L",
        cantidad: 1,
        total: 50,
        creado_en: "2025-11-09T10:23:00",
      },
      {
        id: 18,
        codigo: "V004",
        canal: "Domicilio",
        estado: "Entregado",
        nombre_cliente: "Carlos Gómez",
        direccion: "Calle Norte 55",
        producto: "Garrafón 20L",
        cantidad: 1,
        total: 100,
        creado_en: "2025-11-09T11:45:00",
      },
      {
        id: 19,
        codigo: "V005",
        canal: "Domicilio",
        estado: "Pendiente",
        nombre_cliente: "Lucía Ramírez",
        direccion: "Calle 5 de Mayo 40",
        producto: "Garrafón 20L",
        cantidad: 1,
        total: 75,
        creado_en: "2025-11-09T13:20:00",
      },
      {
        id: 20,
        codigo: "V006",
        canal: "Sucursal",
        estado: "Entregado",
        nombre_cliente: "José Martínez",
        direccion: "Av. Reforma 88",
        producto: "Garrafón 20L",
        cantidad: 1,
        total: 125,
        creado_en: "2025-11-09T14:05:00",
      },
    ];

    setTimeout(() => {
      setPedidos(fakeVentas);
      setLoading(false);
    }, 1000);
  }, []);

  // === 4 columnas ===
  const cardWidth = (Dimensions.get("window").width - 80) / 4;

  const renderItem = ({ item }: { item: Venta }) => (
    <View
      style={[
        s.ventaCard,
        { width: cardWidth },
        item.estado === "Entregado" && s.estadoEntregado,
        item.estado === "Pendiente" && s.estadoPendiente,
      ]}
    >
      <Text style={s.ventaTitle}>{item.codigo}</Text>
      <Text style={s.ventaText}>Cliente: {item.nombre_cliente}</Text>
      <Text style={s.ventaText}>Prod: {item.producto}</Text>
      <Text style={s.ventaText}>Cant: {item.cantidad}</Text>
      <Text style={s.ventaText}>${item.total}</Text>

      <Text style={s.ventaDireccion}>{item.direccion}</Text>

    </View>
  );

  return (
    <View style={s.screen}>
      {/* Encabezado tipo AppBar */}
<View style={s.appbar}>
  <View style={{ width: 50 }} /> {/* espacio fantasma para centrar el título */}

  <Text style={s.appTitle}>PEDIDOS DEL DÍA</Text>

  <TouchableOpacity style={s.appBtn} onPress={() => router.push("/")}>
    <Ionicons name="home-outline" size={18} color="#fff" />
    <Text style={s.appBtnTx}>Inicio</Text>
  </TouchableOpacity>
</View>

      <Text style={s.subtitle}>Visualiza los pedidos asignados y ubicación.</Text>

      {loading && <ActivityIndicator size="large" color="#0d4fa1" />}

      {!loading && (
        <FlatList
          data={pedidos}
          renderItem={renderItem}
          numColumns={4}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={s.row}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

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
  );
}

const s = StyleSheet.create({
  appbar: {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
},

appTitle: {
  fontSize: 22,
  fontWeight: "800",
  color: "#0d4fa1",
  textAlign: "center",
},

appBtn: {
  backgroundColor: "#0d4fa1",
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
},

appBtnTx: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "600",
},

  screen: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0d4fa1",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  ventaCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  ventaTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0d4fa1",
    marginBottom: 4,
  },

  ventaText: {
    fontSize: 11,
    color: "#334155",
  },

  ventaDireccion: {
  marginTop: 6,
  fontSize: 10,
  color: "#475569",
  fontStyle: "italic",
  flexShrink: 1,
  flexWrap: "wrap",
},


  estadoEntregado: {
    backgroundColor: "#dcfce7",
    borderColor: "#22c55e",
  },

  estadoPendiente: {
    backgroundColor: "#fef9c3",
    borderColor: "#eab308",
  },

  mapContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
  },

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
});
