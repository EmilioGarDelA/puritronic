// app/(tabs)/pag_prin.tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import React from 'react';

const { width } = Dimensions.get('window');

const serviceCards = [
  {
    title: '🔬 Purificación Avanzada',
    text: 'Eliminamos bacterias, sedimentos, metales pesados y químicos. Agua segura y cristalina.',
    image: require('../assets/images/purif.jpg'),
  },
  {
    title: '💚 Beneficios para la Salud',
    text: 'Reduce enfermedades gastrointestinales y mejora tu hidratación diaria.',
    image: require('../assets/images/purif2.jpg'),
  },
  {
    title: '🚚 Entrega a Domicilio',
    text: 'Recibe agua purificada sin salir de casa. Comodidad total.',
    image: require('../assets/images/img1.webp'),
  },
  {
    title: '🔧 Mantenimiento y Soporte',
    text: 'Nuestro equipo técnico cuida tus purificadores con servicio preventivo y correctivo.',
    image: require('../assets/images/img2.jpg'),
  },
  {
    title: '🌱 Impacto Ambiental',
    text: 'Reduce el uso de botellas plásticas y ayuda al planeta con cada litro.',
    image: require('../assets/images/img3.webp'),
  },
  {
    title: '🏢 Instalaciones Profesionales',
    text: 'Contamos con centros de purificación certificados y personal capacitado.',
    image: require('../assets/images/logo.jpeg'),
  },
];

export default function PagPrin() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
      <ScrollView contentContainerStyle={s.container}>

        {/* NAVBAR */}
        <View style={s.navbar}>
          <Text style={s.navTitle}>Puritronic</Text>

          <View style={s.navButtons}>
            <TouchableOpacity
              style={s.navLogin}
              onPress={() => router.push('/login')}
            >
              <Text style={s.navLoginText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.navRegister}
              onPress={() => router.push('/registro')}
            >
              <Text style={s.navRegisterText}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HEADER */}
        <View style={s.header}>
          <Text style={s.title}>Puritronic</Text>
          <Text style={s.subtitle}>
            Agua purificada, segura y confiable para tu familia
          </Text>
        </View>

        {/* GRID DE 2 COLUMNAS */}
        <View style={s.services}>
          <Text style={s.sectionTitle}>Conoce Nuestra Purificadora</Text>
          <View style={s.grid}>
            {serviceCards.map((item, idx) => (
              <Animatable.View
                key={idx}
                animation="fadeInUp"
                delay={idx * 100}
                duration={600}
                style={s.card}
              >
                <Image
                  source={item.image}
                  style={s.cardImage}
                  resizeMode="contain"
                />
                <View style={s.cardContent}>
                  <Text style={s.cardTitle}>{item.title}</Text>
                  <Text style={s.cardText}>{item.text}</Text>
                </View>
              </Animatable.View>
            ))}
          </View>
        </View>

        {/* BOTONES */}
        <View style={s.authButtonsContainer}>
          <TouchableOpacity
            style={[s.authBtn, s.loginBtn]}
            onPress={() => router.push('/login')}
          >
            <Text style={[s.authBtnText, { color: '#0d4fa1' }]}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.authBtn, s.registerBtn]}
            onPress={() => router.push('/registro')}
          >
            <Text style={[s.authBtnText, { color: '#fff' }]}>
              Crear Cuenta
            </Text>
          </TouchableOpacity>
        </View>

                {/* FOOTER: LOCACIÓN */}
        <View style={s.locationContainer}>
          <Text style={s.locationTitle}>📍 Locación</Text>
          <Text style={s.locationText}>
            Calle 5 223-C, Fracc. Popular, Pabellón de Arteaga
          </Text>
        </View>

        {/* DERECHOS RESERVADOS */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            © {new Date().getFullYear()} Puritronic. Todos los derechos reservados.
          </Text>
        </View>

        <View style={{ height: 60 }} />


        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 25,
    backgroundColor: '#f4f6f8',
    alignItems: 'center',
  },

  /* NAVBAR */
  navbar: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#0d4fa1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderRadius: 10,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  navLogin: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  navLoginText: {
    color: '#0d4fa1',
    fontWeight: '700',
  },
  navRegister: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ff4d4f',
    borderRadius: 8,
  },
  navRegisterText: {
    color: '#fff',
    fontWeight: '700',
  },

  /* RESTO DE ESTILOS */

    locationContainer: {
    marginTop: 20,
    marginBottom: 5,
    width: "90%",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    alignItems: "center",
    alignSelf: "center",
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0d4fa1",
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: "#334155",
    textAlign: "center",
    paddingHorizontal: 10,
  },

  footer: {
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginTop: 10,
  },

  header: {
    alignItems: 'center',
    marginBottom: 35,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0d4fa1',
    textAlign: 'center',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(13,79,161,0.25)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#ff4d4f',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0d4fa1',
    marginBottom: 22,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  services: {
    width: '94%',
    marginBottom: 40,
  },
grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  columnGap: 16,
  rowGap: 20,
},

card: {
  backgroundColor: "#fff",
  borderRadius: 16,
  overflow: "hidden",
  elevation: 4,
  shadowColor: "#0d4fa1",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.18,
  shadowRadius: 6,
  marginBottom: 18,
  width: width * 0.28,       // 👈 3 tarjetas por fila
  height: 260,               // 👈 altura uniforme
  alignItems: "center",
},

cardImage: {
  width: "100%",
  height: 120,      // 👈 imágenes más grandes y uniformes
  resizeMode: "cover",
  backgroundColor: "#f1f5f9",
},

cardContent: {
  padding: 10,
  alignItems: 'center',
},

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0d4fa1',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 19,
    textAlign: 'center',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 45,
    gap: 18,
  },
  authBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0d4fa1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#0d4fa1',
  },
  registerBtn: {
    backgroundColor: '#0d4fa1',
  },
  authBtnText: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
