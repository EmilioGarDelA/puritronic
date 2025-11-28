import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

// 🔹 Componente Card reutilizable
const Card = ({ title, full, children }: { title: string; full?: boolean; children: React.ReactNode }) => (
  <View style={[s.card, full && s.cardFull]}>
    <Text style={s.cardTitle}>{title}</Text>
    {children}
  </View>
);


export default function AdminHome() {
  const router = useRouter();
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const onLogout = () => router.replace("/");

   useEffect(() => {
  const fakeVentas = [
    {
      id: 12,
      codigo: "V001",
      canal: "Domicilio",
      estado: "Entregado",
      nombre_cliente: "Juan Pérez",
      direccion: "Calle Falsa 123",
      producto: "Garrafón 20L",
      cantidad: 1,
      total: 50,
      creado_en: "2025-11-06T09:15:00",
    },
    {
      id: 13,
      codigo: "V002",
      canal: "Sucursal",
      estado: "Entregado",
      nombre_cliente: "Juan Pérez",
      direccion: "Calle Falsa 123",
      producto: "Garrafón 20L",
      cantidad: 1,
      total: 25,
      creado_en: "2025-11-08T16:40:00",
    },
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
    {
      id: 14,
      codigo: "V007",
      canal: "Domicilio",
      estado: "Pendiente",
      nombre_cliente: "Juan Pérez",
      direccion: "Calle Falsa 123",
      producto: "Garrafón 20L",
      cantidad: 1,
      total: 75,
      creado_en: "2025-11-11T11:05:00",
    },
    {
      id: 15,
      codigo: "V008",
      canal: "Sucursal",
      estado: "Pendiente",
      nombre_cliente: "Juan Pérez",
      direccion: "Calle Falsa 123",
      producto: "Garrafón 20L",
      cantidad: 1,
      total: 100,
      creado_en: "2025-11-14T13:52:00",
    },
    {
      id: 16,
      codigo: "V009",
      canal: "Domicilio",
      estado: "Cancelado",
      nombre_cliente: "Juan Pérez",
      direccion: "Calle Falsa 123",
      producto: "Garrafón 20L",
      cantidad: 1,
      total: 50,
      creado_en: "2025-11-18T08:30:00",
    },
  ];

  setTimeout(() => {
    setVentas(fakeVentas);
    setLoading(false);
  }, 1500);
}, []);


  const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalGarrafones = ventas.reduce((acc, v) => acc + v.cantidad, 0);
  const litrosPurificados = totalGarrafones * 20;

  const renderVenta = ({ item }: { item: any }) => (
  <View
    style={[
      s.ventaItem,
      item.estado === "Entregado"
        ? s.ventaEntregado
        : item.estado === "Pendiente"
        ? s.ventaPendiente
        : s.ventaCancelado,
    ]}
  >
    <Text style={s.ventaItemTitle}>#{item.codigo}</Text>
    <Text style={s.ventaItemText}>{item.nombre_cliente}</Text>
    <Text style={s.ventaItemText}>Producto: {item.producto}</Text>
    <Text style={s.ventaItemText}>{item.cantidad} pz</Text>
    <Text style={s.ventaItemText}>Canal: {item.canal}</Text>
    <Text style={s.ventaItemText}>Estado: {item.estado}</Text>
    <Text style={s.ventaItemText}>Total: ${item.total}</Text>
    <Text style={s.ventaItemText}>
      Fecha: {new Date(item.creado_en).toLocaleString()}
    </Text>
  </View>
);

  return (
    <ScrollView style={s.screen}>
      {/* Body */}
<View style={s.body}>

  {/* Título + Botón en la misma fila */}
<View style={{ 
  flexDirection: "row", 
  alignItems: "center", 
  justifyContent: "space-between",
  width: "100%",
  paddingHorizontal: 10,
  marginBottom: 10
}}>
  <Text style={s.h}>Bienvenido al panel de la Purificadora</Text>

  <TouchableOpacity
    style={{
      backgroundColor: "#007AFF",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8
    }}
    onPress={() => router.push("/")}
  >
    <Text style={{ color: "#fff", fontWeight: "bold" }}>Inicio</Text>
  </TouchableOpacity>
</View>


  {/* Resumen azul en una sola fila y centrado */}
<View
  style={[
    s.cardSummary,
    {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    },
  ]}
>
  <Text style={s.cardSummaryTx}>💧 Ventas de hoy: {ventas.length}</Text>
  <Text style={s.cardSummaryTx}> | </Text>

  <Text style={s.cardSummaryTx}>🧃 Garrafones vendidos: {totalGarrafones}</Text>
  <Text style={s.cardSummaryTx}> | </Text>

  <Text style={s.cardSummaryTx}>💵 Ingreso total: ${totalVentas}</Text>
  <Text style={s.cardSummaryTx}> | </Text>

  <Text style={s.cardSummaryTx}>🚰 Litros purificados: {litrosPurificados}L</Text>
</View>


  {/* VENTAS (NO VA EN GRID) */}
  <Card title="📋 Ventas registradas" full>

    {loading ? (
      <ActivityIndicator size="large" color="#0d4fa1" />
    ) : (
      <FlatList
      data={ventas}
      renderItem={renderVenta}
      keyExtractor={(item) => item.codigo}
      numColumns={3}
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: 6,
      }}
      contentContainerStyle={{ paddingTop: 10 }}
    />

    )}
  </Card>

  {/* GRID de tarjetas pequeñas */}
  <View style={s.grid}>

    <Card title="📦 Inventario">
      <Text style={s.cardText}>Garrafones disponibles: 150</Text>
      <Text style={s.cardText}>Tapas y etiquetas: 500 unidades</Text>
      <Text style={s.cardText}>Botellas 1L: 320 unidades</Text>
    </Card>

    <Card title="⚙️ Mantenimiento">
      <Text style={s.cardText}>Último mantenimiento: 02/11/2025</Text>
      <Text style={s.cardText}>Próximo mantenimiento: 16/11/2025</Text>
    </Card>

    <Card title="🚚 Pedidos en curso">
      <Text style={s.cardText}>1 pedido pendiente de entrega (Lucía Ramírez).</Text>
    </Card>

    <Card title="📊 Reportes">
      <Text style={s.cardText}>Genera reportes de ventas, ingresos y rendimiento semanal.</Text>
    </Card>

    <Card title="👥 Usuarios del sistema">
      <Text style={s.cardText}>
        • Admin: admin@puritronic.com{"\n"}
        • Empleados activos: 3
      </Text>
    </Card>

    <Card title="🧾 Auditoría">
      <Text style={s.cardText}>Registro de ventas, accesos y cambios de precios.</Text>
    </Card>

  </View>

  

</View>

    </ScrollView>
  );
}

const s = StyleSheet.create({

  cardFull: {
  width: "100%",        // Ocupa TODO el ancho, como el resumen azul
  marginVertical: 6,
},

  screen: {
    flex: 1,
    backgroundColor: "#eef2f7",
  },

  body: {
    paddingHorizontal: 12,
    paddingTop: 14,
    gap: 12,
  },

  h: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: -2,
  },

  /* ----------------------------- RESUMEN AZUL ----------------------------- */
  cardSummary: {
    backgroundColor: "#0d4fa1",
    padding: 18,
    borderRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#0b3d82",
  },

  cardSummaryTx: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },

  /* ----------------------------- TARJETAS GENERALES ----------------------------- */
  card: {
    width: "32%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0d4fa1",
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 18,
  },

  /* ----------------------------- GRID DE TARJETAS ----------------------------- */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingTop: 10,
    gap: 12,
  },

  /* ----------------------------- TARJETAS DE VENTAS ----------------------------- */
  ventaItem: {
    width: "31%",          // Ajuste perfecto para 3 columnas
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    backgroundColor: "#fff",
    marginBottom: 12,
  },

  ventaItemTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
    color: "#0d4fa1",
  },

  ventaItemText: {
    fontSize: 13,
    marginBottom: 2,
    color: "#334155",
  },

  /* Estados de venta */
  ventaEntregado: {
    backgroundColor: "#dcfce7",
    borderColor: "#22c55e",
  },

  ventaPendiente: {
    backgroundColor: "#fef9c3",
    borderColor: "#eab308",
  },

  ventaCancelado: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
  },
});
