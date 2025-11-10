import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ClienteDirecciones() {
  const router = useRouter();
  return (
    <View style={s.screen}>
      <View style={s.appbar}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>‹ Atrás</Text></TouchableOpacity>
        <Text style={s.appTitle}>Direcciones</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={s.body}>
        <Text style={s.h}>Mis direcciones</Text>
        <View style={s.card}><Text>Agrega tu dirección en “Nueva compra”.</Text></View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  screen:{flex:1,backgroundColor:"#f6f7fb"},
  appbar:{height:56,backgroundColor:"#0f172a",flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:16},
  appTitle:{color:"#fff",fontSize:16,fontWeight:"800"}, back:{color:"#fff",fontWeight:"700"},
  body:{padding:16}, h:{fontSize:18,fontWeight:"800",color:"#111827",marginBottom:12},
  card:{backgroundColor:"#fff",padding:16,borderRadius:16,elevation:2,shadowColor:"#000",shadowOpacity:0.06,shadowRadius:12}
});
