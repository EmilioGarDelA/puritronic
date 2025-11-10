import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

export default function AdminHome() {
  const router = useRouter();
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const onLogout = () => {
    router.replace("/");
  };

  useEffect(() => {
    // Simulación local de ventas
    const fakeVentas = [
      {
        id: 1,
        codigo: "V001",
        nombre_cliente: "María López",
        canal: "Sucursal",
        estado: "Completada",
        cantidad: 2,
        producto: "Garrafón 20L",
        total: 50,
        creado_en: "2025-11-09T10:23:00",
      },
      {
        id: 2,
        codigo: "V002",
        nombre_cliente: "Carlos Gómez",
        canal: "Domicilio",
        estado: "Entregada",
        cantidad: 4,
        producto: "Garrafón 20L",
        total: 100,
        creado_en: "2025-11-09T11:45:00",
      },
      {
        id: 3,
        codigo: "V003",
        nombre_cliente: "Juan Pérez",
        canal: "Sucursal",
        estado: "Completada",
        cantidad: 1,
        producto: "Garrafón 20L",
        total: 25,
        creado_en: "2025-11-09T12:10:00",
      },
      {
        id: 4,
        codigo: "V004",
        nombre_cliente: "Lucía Ramírez",
        canal: "Domicilio",
        estado: "Pendiente",
        cantidad: 3,
        producto: "Garrafón 20L",
        total: 75,
        creado_en: "2025-11-09T13:20:00",
      },
      {
        id: 5,
        codigo: "V005",
        nombre_cliente: "José Martínez",
        canal: "Sucursal",
        estado: "Completada",
        cantidad: 5,
        producto: "Garrafón 20L",
        total: 125,
        creado_en: "2025-11-09T14:05:00",
      },
    ];

    // Simulación de carga
    setTimeout(() => {
      setVentas(fakeVentas);
      setLoading(false);
    }, 1500);
  }, []);

  const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalGarrafones = ventas.reduce((acc, v) => acc + v.cantidad, 0);
  const litrosPurificados = totalGarrafones * 20;

  return (
    <ScrollView style={s.screen}>
      {/* Appbar */}
      <View style={s.appbar}>
        <Text style={s.appTitle}>Panel de Administración</Text>
        <TouchableOpacity onPress={onLogout} style={s.appBtn}>
          <Text style={s.appBtnTx}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={s.body}>
        <Text style={s.h}>Bienvenido al panel de la Purificadora</Text>

        {/* Resumen general */}
        <View style={s.cardSummary}>
          <Text style={s.cardSummaryTx}>
            💧 Ventas de hoy: {ventas.length}
          </Text>
          <Text style={s.cardSummaryTx}>
            🧃 Garrafones vendidos: {totalGarrafones}
          </Text>
          <Text style={s.cardSummaryTx}>
            💵 Ingreso total: ${totalVentas}
          </Text>
          <Text style={s.cardSummaryTx}>
            🚰 Litros purificados: {litrosPurificados}L
          </Text>
        </View>

        {/* Ventas */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📋 Ventas registradas</Text>
          <Text style={s.cardText}>
            Detalle de las últimas operaciones realizadas:
          </Text>

          {loading && <ActivityIndicator size="large" color="#0d4fa1" />}

          {!loading &&
            ventas.map((v) => (
              <View key={v.id} style={s.ventaItem}>
                <Text style={s.ventaTitle}>
                  #{v.codigo} - {v.nombre_cliente}
                </Text>
                <Text style={s.ventaText}>
                  Producto: {v.producto} ({v.cantidad} pz)
                </Text>
                <Text style={s.ventaText}>
                  Canal: {v.canal} | Estado: {v.estado}
                </Text>
                <Text style={s.ventaText}>Total: ${v.total}</Text>
                <Text style={s.ventaText}>
                  Fecha: {new Date(v.creado_en).toLocaleString()}
                </Text>
              </View>
            ))}
        </View>

        {/* Inventario */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📦 Inventario</Text>
          <Text style={s.cardText}>Garrafones disponibles: 150</Text>
          <Text style={s.cardText}>Tapas y etiquetas: 500 unidades</Text>
          <Text style={s.cardText}>Botellas 1L: 320 unidades</Text>
        </View>

        {/* Mantenimiento */}
        <View style={s.card}>
          <Text style={s.cardTitle}>⚙️ Mantenimiento</Text>
          <Text style={s.cardText}>
            Último mantenimiento: 02/11/2025
          </Text>
          <Text style={s.cardText}>
            Próximo mantenimiento programado: 16/11/2025
          </Text>
        </View>

        {/* Pedidos */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🚚 Pedidos en curso</Text>
          <Text style={s.cardText}>
            1 pedido pendiente de entrega (Lucía Ramírez).
          </Text>
        </View>

        {/* Reportes */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📊 Reportes</Text>
          <Text style={s.cardText}>
            Genera reportes de ventas, ingresos y rendimiento semanal.
          </Text>
        </View>

        {/* Usuarios */}
        <View style={s.card}>
          <Text style={s.cardTitle}>👥 Usuarios del sistema</Text>
          <Text style={s.cardText}>
            - Admin principal: admin@puritronic.com{"\n"}
            - Empleados activos: 3
          </Text>
        </View>

        {/* Auditoría */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🧾 Auditoría</Text>
          <Text style={s.cardText}>
            Registro automático de todas las ventas, accesos y cambios en
            precios.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  appbar: {
    height: 56,
    backgroundColor: "#0f172a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  appTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  appBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#1f2b4c",
    borderRadius: 8,
  },
  appBtnTx: {
    color: "#fff",
    fontWeight: "700",
  },
  body: {
    padding: 16,
    paddingTop: 20,
  },
  h: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0d4fa1",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#334155",
  },
  ventaItem: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  ventaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0d4fa1",
  },
  ventaText: {
    fontSize: 14,
    color: "#334155",
  },
  cardSummary: {
    backgroundColor: "#0d4fa1",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardSummaryTx: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
});
