
import React, { useRef, useState } from "react";

import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Evento {
  id: number;
  titulo: string;
  data: string;
}

interface EventoCardProps {
  evento: Evento;
}

const eventos: Evento[] = [
  { id: 1, titulo: "Amostra interativa...", data: "18/11" },
  { id: 2, titulo: "Amostra interativa...", data: "18/11" },
  { id: 3, titulo: "Amostra interativa...", data: "18/11" },
  { id: 4, titulo: "Amostra interativa...", data: "18/11" },
  { id: 5, titulo: "Amostra interativa...", data: "18/11" },
  { id: 6, titulo: "Amostra interativa...", data: "18/11" },
  { id: 7, titulo: "Amostra interativa...", data: "18/11" },
  { id: 8, titulo: "Amostra interativa...", data: "18/11" },
];

const atalhos: string[] = [
  "Mural de homenagens",
  "Calendário oficial",
  "Últimos editais",
  "Instituições",
  "Feed de eventos",
];

// LOGO IF
function Logo() {
  return (
    <View style={styles.logo}>
      <View style={[styles.logoRed, { left: 10, top: 10 }]} />

      <View style={[styles.logoSquare, { left: 94, top: 10 }]} />
      <View style={[styles.logoSquare, { left: 177, top: 10 }]} />

      <View style={[styles.logoSquare, { left: 10, top: 91 }]} />
      <View style={[styles.logoSquare, { left: 94, top: 91 }]} />

      <View style={[styles.logoSquare, { left: 10, top: 172 }]} />
      <View style={[styles.logoSquare, { left: 94, top: 172 }]} />
      <View style={[styles.logoSquare, { left: 177, top: 172 }]} />

      <View style={[styles.logoSquare, { left: 10, top: 253 }]} />
      <View style={[styles.logoSquare, { left: 94, top: 253 }]} />
    </View>
  );
}

// HEADER
function Header() {
  return (
    <View style={styles.header}>
      <Logo />

      <View style={styles.search}>
        <MaterialCommunityIcons name="magnify" size={23} color="#555" />

        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          placeholderTextColor="#777"
        />
      </View>

      <View style={styles.headerActions}>
        <Pressable
          style={styles.headerButton}
          accessibilityLabel="Notificações"
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={25}
            color="#333"
          />
        </Pressable>

        <Pressable
          style={styles.headerButton}
          accessibilityLabel="Perfil"
        >
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={27}
            color="#333"
          />
        </Pressable>
      </View>
    </View>
  );
}

// BANNER
function Banner() {
  const [active, setActive] = useState<number>(0);
  const carouselRef = useRef<ScrollView>(null);

  function handleScroll(event: any) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const itemWidth = width * 0.85 + 8;
    const index = Math.round(offsetX / itemWidth);

    setActive(Math.max(0, Math.min(index, 4)));
  }

  return (
    <View style={styles.bannerSection}>
      <ScrollView
        ref={carouselRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.bannerCarousel}
        snapToInterval={width * 0.85 + 8}
        decelerationRate="fast"
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.bannerItem}></View>
        ))}
      </ScrollView>

      <View style={styles.carouselIndicators}>
        {[0, 1, 2, 3, 4].map((item) => (
          <View
            key={item}
            style={[
              styles.indicator,
              active === item && styles.indicatorActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// INSTITUIÇÕES
function Instituicoes() {
  return (
    <View style={styles.instituicoes}>
      <Text style={styles.sectionTitle}>Instituições</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.instituicoesList}
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.instituicaoCard}></View>
        ))}
      </ScrollView>
    </View>
  );
}

// PANORAMA IFSP
function Panorama() {
  return (
    <View style={styles.panorama}>
      <Text style={styles.panoramaTitle}>Panorama IFSP</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.shortcuts}
        decelerationRate="fast"
      >
        {atalhos.map((atalho, index) => (
          <Pressable key={index} style={styles.shortcut}>
            <Text style={styles.shortcutText}>{atalho}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// CARD DE EVENTO
function EventoCard({ evento }: EventoCardProps) {
  return (
    <View style={styles.eventoCard}>
      <View style={styles.eventoImage} />

      <Text style={styles.eventoTitle}>{evento.titulo}</Text>

      <Text style={styles.eventoDate}>{evento.data}</Text>
    </View>
  );
}

// FEED DE EVENTOS
function FeedEventos() {
  return (
    <View style={styles.feed}>
      <View style={styles.eventosGrid}>

        {/* COLUNA ESQUERDA */}
        <View style={styles.colunaEventos}>
          <Text style={styles.feedTitle}>
            Feed de{"\n"}eventos
          </Text>

          <View style={styles.eventosEsquerda}>
            {eventos
              .filter((evento) => evento.id % 2 === 0)
              .map((evento) => (
                <EventoCard key={evento.id} evento={evento} />
              ))}
          </View>
        </View>

        {/* COLUNA DIREITA */}
        <View style={[styles.colunaEventos, styles.colunaDireita]}>
          <EventoCard evento={eventos[0]} />

          {eventos
            .filter(
              (evento) => evento.id % 2 !== 0 && evento.id !== 1
            )
            .map((evento) => (
              <EventoCard key={evento.id} evento={evento} />
            ))}
        </View>

      </View>
    </View>
  );
}

// HOME
export default function Home() {
  return (
    <ScrollView
      style={styles.home}
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <Banner />
      <Instituicoes />
      <Panorama />
      <FeedEventos />
    </ScrollView>
  );
}

// ESTILOS
const styles = StyleSheet.create({

  home: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 10,
  },

  // LOGO IF
  logo: {
    width: 40,
    height: 40,
    position: "relative",
    transform: [{ scale: 0.12 }],
    transformOrigin: "top left",
  },

  logoRed: {
    position: "absolute",
    width: 74,
    height: 74,
    borderRadius: 50,
    backgroundColor: "#C82026",
  },

  logoSquare: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 7,
    backgroundColor: "#39983B",
  },

  // PESQUISA
  search: {
    flex: 1,
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 7,
  },

  searchInput: {
    flex: 1,
    paddingHorizontal: 0,
    color: "#222",
  },

  // ÍCONES DO HEADER
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },

  headerButton: {
    width: 32,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  // BANNER
  bannerSection: {
    marginTop: 15,
  },

  bannerCarousel: {
    paddingHorizontal: width * 0.075,
    gap: 8,
  },

  bannerItem: {
    width: width * 0.85,
    height: 170,
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
  },

  carouselIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    marginTop: 15,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "#CCCCCC",
  },

  indicatorActive: {
    width: 8,
    height: 8,
    backgroundColor: "#168B45",
  },

  // INSTITUIÇÕES
  instituicoes: {
    marginTop: 30,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 15,
  },

  instituicoesList: {
    gap: 12,
  },

  instituicaoCard: {
    width: 110,
    height: 90,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
  },

  // PANORAMA IFSP
  panorama: {
    marginTop: 35,
    width: "100%",
  },

  panoramaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#299E42",
    textAlign: "right",
    paddingHorizontal: 16,
    marginBottom: 0,
  },

  shortcuts: {
    backgroundColor: "#359E3F",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  shortcut: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
  },

  shortcutText: {
    fontSize: 14,
    color: "#299E42",
    fontWeight: "bold",
    textAlign: "center",
  },

  // FEED DE EVENTOS
  feed: {
    marginTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  // GRID DE DUAS COLUNAS
  eventosGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 0,
  },

  colunaEventos: {
    flex: 1,
    gap: 12,
  },

  colunaDireita: {
    marginTop: 1,
  },

  // TÍTULO VERDE
  feedTitle: {
    width: "100%",
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#168B45",
    padding: 6,
    marginLeft: -20,
  },

  // ESPAÇAMENTO DA COLUNA ESQUERDA
  eventosEsquerda: {
    marginTop: 18,
    gap: 12,
  },

  // CARD DE EVENTO
  colunaCard: {
    width: "48%",
  },

  eventoCard: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    paddingBottom: 4,
  },

  eventoImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
  },

  eventoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
  },

  eventoDate: {
    fontSize: 13,
    color: "#168B45",
    marginTop: 3,
  },

});
