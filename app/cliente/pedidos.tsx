import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

const pedidos = [
  {
    id: "P001",
    producto: "Garrafón 20L (2 pz)",
    canal: "Domicilio",
    estado: "Entregado",
    total: 50,
    fecha: "06/11/2025, 9:15 a.m.",
  },
  {
    id: "P002",
    producto: "Garrafón 20L (1 pz)",
    canal: "Sucursal",
    estado: "Completado",
    total: 25,
    fecha: "08/11/2025, 4:40 p.m.",
  },
  {
    id: "P003",
    producto: "Garrafón 20L (3 pz)",
    canal: "Domicilio",
    estado: "Pendiente de entrega",
    total: 75,
    fecha: "11/11/2025, 11:05 a.m.",
  },
  {
    id: "P004",
    producto: "Garrafón 20L (4 pz)",
    canal: "Sucursal",
    estado: "En proceso",
    total: 100,
    fecha: "14/11/2025, 1:52 p.m.",
  },
  {
    id: "P005",
    producto: "Garrafón 20L (2 pz)",
    canal: "Domicilio",
    estado: "Cancelado",
    total: 50,
    fecha: "18/11/2025, 8:30 a.m.",
  },
];

export default function ClientePedidos() {
  const router = useRouter();

  const getEstadoColor = (estado: string | string[]) => {
    if (estado.includes("Entregado") || estado.includes("Completado")) return "#16a34a";
    if (estado.includes("Proceso")) return "#f59e0b";
    if (estado.includes("Pendiente")) return "#3b82f6";
    if (estado.includes("Cancelado")) return "#dc2626";
    return "#6b7280";
  };

  return (
    <View style={s.screen}>
      <View style={s.appbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>‹ Atrás</Text>
        </TouchableOpacity>
        <Text style={s.appTitle}>Mis pedidos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.body}>
        

        <View style={s.grid}>
          {pedidos.map((p) => (
            <View key={p.id} style={s.card}>
              <Text style={s.id}>#{p.id}</Text>

              <Text style={s.prod}>{p.producto}</Text>

              <Text style={s.t}>Canal: {p.canal}</Text>

              <View style={[s.badge, { backgroundColor: getEstadoColor(p.estado) }]}>
                <Text style={s.badgeTx}>{p.estado}</Text>
              </View>

              <Text style={s.total}>${p.total}</Text>
              <Text style={s.fecha}>{p.fecha}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f6f7fb" },

  /* APPBAR */
  appbar: {
    height: 56,
    backgroundColor: "#0f172a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  appTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  back: { color: "#fff", fontWeight: "700", fontSize: 14 },

  body: {
    padding: 16,
    paddingBottom: 40,
  },
  h: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 12,
  },

  /* GRID DE CONTENEDORES */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  /* CARD MINI */
  card: {
    width: "47%",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 6,
  },

  id: { fontWeight: "800", fontSize: 14, color: "#1e293b" },

  prod: {
    fontWeight: "700",
    fontSize: 13,
    color: "#334155",
  },

  t: {
    fontSize: 12,
    color: "#475569",
  },

  /* ETIQUETA DE ESTADO */
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  badgeTx: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
  },

  total: {
    fontWeight: "800",
    fontSize: 14,
    marginTop: 4,
    color: "#0f172a",
  },

  fecha: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
});
