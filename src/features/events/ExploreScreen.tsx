import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppMark } from './components/AppMark';
import { EventCard } from './components/EventCard';
import type { ExploreEvent } from './types';

const GREEN = '#259B4B';
const DEFAULT_CATEGORIES = [
  'Esporte',
  'Cultura',
  'Tecnologia',
  'Literatura',
  'Arte',
  'Meio ambiente',
];

interface ExploreScreenProps {
  events: ExploreEvent[];
  institutions: string[];
  onOpenEvent: (eventId: string) => void;
  categories?: string[];
  loading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export function ExploreScreen({
  events,
  institutions,
  onOpenEvent,
  categories = DEFAULT_CATEGORIES,
  loading = false,
  errorMessage,
  onRetry,
}: ExploreScreenProps) {
  const [search, setSearch] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const [showAllInstitutions, setShowAllInstitutions] = useState(false);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');

    return events.filter((event) => {
      const matchesSearch =
        !normalizedSearch ||
        [event.title, event.category, event.institution].some((value) =>
          value.toLocaleLowerCase('pt-BR').includes(normalizedSearch),
        );
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(event.category);
      const matchesInstitution =
        selectedInstitutions.length === 0 || selectedInstitutions.includes(event.institution);

      return matchesSearch && matchesCategory && matchesInstitution;
    });
  }, [events, search, selectedCategories, selectedInstitutions]);

  const toggleValue = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setSelected((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedInstitutions([]);
    setSearch('');
  };

  const displayedInstitutions = showAllInstitutions ? institutions : institutions.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <AppMark />
        <View style={styles.headerActions}>
          <MaterialCommunityIcons name="bell-outline" size={19} color={GREEN} />
          <View style={styles.profileIcon}>
            <Feather name="user" size={14} color={GREEN} />
          </View>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={17} color={GREEN} />
          <TextInput
            accessibilityLabel="Buscar eventos"
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar eventos"
            placeholderTextColor="#8B8B8B"
            returnKeyType="search"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <Pressable accessibilityLabel="Limpar busca" onPress={() => setSearch('')} hitSlop={8}>
              <Feather name="x-circle" size={16} color="#8B8B8B" />
            </Pressable>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={filtersVisible ? 'Fechar filtros' : 'Abrir filtros'}
          onPress={() => setFiltersVisible((visible) => !visible)}
          style={styles.filterButton}
        >
          {filtersVisible ? (
            <Feather name="x-circle" size={21} color="#E53935" />
          ) : (
            <Feather name="sliders" size={21} color={GREEN} />
          )}
        </Pressable>
      </View>

      {filtersVisible && (
        <View style={styles.filterPanel}>
          <View style={styles.filterTitleRow}>
            <Text style={styles.filterTitle}>Categoria</Text>
            {(selectedCategories.length > 0 || selectedInstitutions.length > 0) && (
              <Pressable onPress={clearFilters} accessibilityRole="button">
                <Text style={styles.clearText}>Limpar</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.chipWrap}>
            {categories.map((category) => {
              const selected = selectedCategories.includes(category);
              return (
                <FilterChip
                  key={category}
                  label={category}
                  selected={selected}
                  onPress={() => toggleValue(category, selectedCategories, setSelectedCategories)}
                />
              );
            })}
          </View>

          <Text style={[styles.filterTitle, styles.institutionHeading]}>Instituição</Text>
          <View style={styles.chipWrap}>
            {displayedInstitutions.map((institution) => (
              <FilterChip
                key={institution}
                label={institution}
                selected={selectedInstitutions.includes(institution)}
                onPress={() =>
                  toggleValue(institution, selectedInstitutions, setSelectedInstitutions)
                }
              />
            ))}
            {institutions.length > 5 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={showAllInstitutions ? 'Mostrar menos instituições' : 'Mostrar mais instituições'}
                onPress={() => setShowAllInstitutions((current) => !current)}
                style={styles.moreButton}
              >
                <Feather name={showAllInstitutions ? 'minus' : 'plus'} size={18} color={GREEN} />
              </Pressable>
            )}
          </View>
        </View>
      )}

      <FlatList
        data={filteredEvents}
        keyExtractor={(event) => event.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <EventCard event={item} onPress={onOpenEvent} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {loading ? (
              <ActivityIndicator color={GREEN} />
            ) : (
              <>
                <Feather name="calendar" size={28} color="#A0A0A0" />
                <Text style={styles.emptyTitle}>
                  {errorMessage ? 'Não foi possível carregar os eventos' : 'Nenhum evento encontrado'}
                </Text>
                <Text style={styles.emptyDescription}>
                  {errorMessage ?? 'Tente alterar a busca ou os filtros selecionados.'}
                </Text>
                {errorMessage && onRetry && (
                  <Pressable onPress={onRetry} style={styles.retryButton}>
                    <Text style={styles.retryText}>Tentar novamente</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text numberOfLines={1} style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    minHeight: 62,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  profileIcon: {
    width: 32,
    height: 32,
    borderWidth: 1.3,
    borderColor: GREEN,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchRow: {
    minHeight: 58,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  searchBox: {
    height: 45,
    flex: 1,
    borderColor: GREEN,
    borderWidth: 1,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    color: '#262626',
    fontSize: 16,
    paddingVertical: 0,
  },

  filterButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterPanel: {
    marginHorizontal: 14,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 14,
  },

  filterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  filterTitle: {
    color: GREEN,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  clearText: {
    color: GREEN,
    fontSize: 14,
    marginBottom: 8,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },

  chip: {
    minHeight: 34,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  chipSelected: {
    backgroundColor: '#E8F5EC',
    borderWidth: 1.4,
  },

  chipText: {
    color: GREEN,
    fontSize: 13,
  },

  chipTextSelected: {
    fontWeight: '700',
  },

  institutionHeading: {
    marginTop: 14,
  },

  moreButton: {
    height: 32,
    width: 32,
    borderColor: GREEN,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 30,
    flexGrow: 1,
  },

  gridRow: {
    justifyContent: 'space-between',
  },

  emptyState: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },

  emptyTitle: {
    color: '#333333',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },

  emptyDescription: {
    color: '#777777',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 8,
    borderRadius: 9,
    backgroundColor: GREEN,
    paddingHorizontal: 17,
    paddingVertical: 11,
  },

  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

