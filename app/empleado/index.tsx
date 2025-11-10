import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform } from "react-native";
import { WebView } from "react-native-webview"; // web-compatible

export default function EmpleadoPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fakePedidos = [
      { id: 1, cliente: "María López", tipo: "Sucursal", estado: "Listo para recoger", direccion: null },
      { id: 2, cliente: "Carlos Gómez", tipo: "Domicilio", estado: "En ruta", direccion: "Calle 5 de Mayo #25, Pabellón de Arteaga, Ags." },
      { id: 3, cliente: "Lucía Ramírez", tipo: "Domicilio", estado: "Pendiente de entrega", direccion: "Av. Juárez 102, Pabellón de Arteaga, Ags." },
      { id: 4, cliente: "Juan Pérez", tipo: "Sucursal", estado: "Entregado", direccion: null },
      { id: 5, cliente: "José Martínez", tipo: "Domicilio", estado: "Preparando pedido", direccion: "Calle Reforma 45, Pabellón de Arteaga, Ags." },
    ];

    setTimeout(() => {
      setPedidos(fakePedidos);
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <ScrollView style={s.screen}>
      <Text style={s.title}>Pedidos del Día</Text>
      <Text style={s.subtitle}>Visualiza los pedidos asignados y ubicación base.</Text>

      {loading && <ActivityIndicator size="large" color="#0d4fa1" />}

      {!loading && (
        <>
          {pedidos.map((p) => (
            <View key={p.id} style={s.card}>
              <Text style={s.cardTitle}>#{p.id} - {p.cliente}</Text>
              <Text style={s.cardText}>Tipo: {p.tipo}</Text>
              <Text style={s.cardText}>Estado: {p.estado}</Text>
              {p.tipo === "Domicilio" && (
                <Text style={s.cardText}>Dirección: {p.direccion}</Text>
              )}
            </View>
          ))}

          {/* Mapa embebido - sin librerías nativas */}
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
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0d4fa1",
  },
  cardText: {
    fontSize: 14,
    color: "#334155",
    marginTop: 4,
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
