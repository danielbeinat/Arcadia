import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useDebounce } from './useDebounce';

export interface SearchFilters {
  category?: 'courses' | 'degrees' | 'professors' | 'all';
  level?: 'beginner' | 'intermediate' | 'advanced';
  credits?: number;
  duration?: string;
  modality?: 'presencial' | 'virtual' | 'hibrido';
  department?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface SearchResult {
  id: string;
  type: 'course' | 'degree' | 'professor';
  title: string;
  description: string;
  category?: string;
  level?: string;
  credits?: number;
  duration?: string;
  modality?: string;
  department?: string;
  price?: number;
  rating?: number;
  enrollmentCount?: number;
  imageUrl?: string;
  professor?: string;
  tags?: string[];
  highlighted?: string;
  relevanceScore?: number;
}

export interface SearchState {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  suggestions: string[];
  recentSearches: string[];
  popularSearches: string[];
}

export interface UseAdvancedSearchReturn extends SearchState {
  search: (query: string, filters?: SearchFilters, page?: number) => Promise<void>;
  searchWithSuggestions: (query: string) => Promise<string[]>;
  clearResults: () => void;
  loadMore: () => Promise<void>;
  addToRecentSearches: (query: string) => void;
  removeFromRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
  getPopularSearches: () => Promise<string[]>;
}

const ITEMS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 300;
const RECENT_SEARCHES_KEY = 'academianova_recent_searches';
const MAX_RECENT_SEARCHES = 10;

export const useAdvancedSearch = (): UseAdvancedSearchReturn => {
  const [state, setState] = useState<SearchState>({
    results: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    hasMore: false,
    suggestions: [],
    recentSearches: [],
    popularSearches: [],
  });

  const [currentQuery, setCurrentQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(0);

  // Initialize recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        const recentSearches = JSON.parse(stored);
        setState(prev => ({ ...prev, recentSearches }));
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }
  }, []);

  // Build full-text search query
  const buildSearchQuery = useCallback((query: string, filters: SearchFilters) => {
    // Clean and prepare search terms
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return null;

    // Convert to PostgreSQL full-text search format
    const searchTerms = cleanQuery
      .split(/\s+/)
      .filter(term => term.length > 2)
      .map(term => `${term}:*`)
      .join(' & ');

    return searchTerms;
  }, []);

  // Search courses with full-text search
  const searchCourses = useCallback(async (
    query: string,
    filters: SearchFilters,
    page: number = 0
  ): Promise<{ data: SearchResult[], count: number }> => {
    const searchTerms = buildSearchQuery(query, filters);
    if (!searchTerms) return { data: [], count: 0 };

    let courseQuery = supabase
      .from('courses')
      .select(`
        id,
        name,
        description,
        category,
        level,
        credits,
        duration,
        modality,
        department,
        price,
        rating,
        enrollment_count,
        image_url,
        professor_name,
        tags,
        ts_vector
      `, { count: 'exact' })
      .textSearch('ts_vector', searchTerms, {
        type: 'websearch',
        config: 'spanish'
      });

    // Apply filters
    if (filters.level) {
      courseQuery = courseQuery.eq('level', filters.level);
    }
    if (filters.credits) {
      courseQuery = courseQuery.eq('credits', filters.credits);
    }
    if (filters.modality) {
      courseQuery = courseQuery.eq('modality', filters.modality);
    }
    if (filters.department) {
      courseQuery = courseQuery.eq('department', filters.department);
    }
    if (filters.minPrice !== undefined) {
      courseQuery = courseQuery.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      courseQuery = courseQuery.lte('price', filters.maxPrice);
    }

    // Pagination and ordering
    courseQuery = courseQuery
      .order('rating', { ascending: false })
      .order('enrollment_count', { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    const { data, error, count } = await courseQuery;

    if (error) {
      throw new Error(`Course search error: ${error.message}`);
    }

    const results: SearchResult[] = (data || []).map(course => ({
      id: course.id,
      type: 'course' as const,
      title: course.name,
      description: course.description,
      category: course.category,
      level: course.level,
      credits: course.credits,
      duration: course.duration,
      modality: course.modality,
      department: course.department,
      price: course.price,
      rating: course.rating,
      enrollmentCount: course.enrollment_count,
      imageUrl: course.image_url,
      professor: course.professor_name,
      tags: course.tags,
      relevanceScore: Math.random() * 0.3 + 0.7, // Mock relevance score
    }));

    return { data: results, count: count || 0 };
  }, [buildSearchQuery]);

  // Search degrees
  const searchDegrees = useCallback(async (
    query: string,
    filters: SearchFilters,
    page: number = 0
  ): Promise<{ data: SearchResult[], count: number }> => {
    const searchTerms = buildSearchQuery(query, filters);
    if (!searchTerms) return { data: [], count: 0 };

    let degreeQuery = supabase
      .from('degrees')
      .select(`
        id,
        name,
        description,
        category,
        level,
        duration,
        modality,
        department,
        price,
        image_url,
        total_credits,
        ts_vector
      `, { count: 'exact' })
      .textSearch('ts_vector', searchTerms, {
        type: 'websearch',
        config: 'spanish'
      });

    // Apply filters
    if (filters.level) {
      degreeQuery = degreeQuery.eq('level', filters.level);
    }
    if (filters.modality) {
      degreeQuery = degreeQuery.eq('modality', filters.modality);
    }
    if (filters.department) {
      degreeQuery = degreeQuery.eq('department', filters.department);
    }

    degreeQuery = degreeQuery
      .order('name', { ascending: true })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    const { data, error, count } = await degreeQuery;

    if (error) {
      throw new Error(`Degree search error: ${error.message}`);
    }

    const results: SearchResult[] = (data || []).map(degree => ({
      id: degree.id,
      type: 'degree' as const,
      title: degree.name,
      description: degree.description,
      category: degree.category,
      level: degree.level,
      duration: degree.duration,
      modality: degree.modality,
      department: degree.department,
      price: degree.price,
      imageUrl: degree.image_url,
      credits: degree.total_credits,
      relevanceScore: Math.random() * 0.3 + 0.7,
    }));

    return { data: results, count: count || 0 };
  }, [buildSearchQuery]);

  // Search professors
  const searchProfessors = useCallback(async (
    query: string,
    filters: SearchFilters,
    page: number = 0
  ): Promise<{ data: SearchResult[], count: number }> => {
    const searchTerms = buildSearchQuery(query, filters);
    if (!searchTerms) return { data: [], count: 0 };

    let professorQuery = supabase
      .from('users')
      .select(`
        id,
        name,
        lastName,
        email,
        program as department,
        avatar,
        professorId,
        ts_vector
      `, { count: 'exact' })
      .eq('role', 'PROFESSOR')
      .textSearch('ts_vector', searchTerms, {
        type: 'websearch',
        config: 'spanish'
      });

    professorQuery = professorQuery
      .order('name', { ascending: true })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    const { data, error, count } = await professorQuery;

    if (error) {
      throw new Error(`Professor search error: ${error.message}`);
    }

    const results: SearchResult[] = (data || []).map(professor => ({
      id: professor.id,
      type: 'professor' as const,
      title: `${professor.name} ${professor.lastName}`,
      description: `Profesor del departamento de ${professor.department}`,
      department: professor.department,
      imageUrl: professor.avatar,
      relevanceScore: Math.random() * 0.3 + 0.7,
    }));

    return { data: results, count: count || 0 };
  }, [buildSearchQuery]);

  // Main search function
  const search = useCallback(async (
    query: string,
    filters: SearchFilters = {},
    page: number = 0
  ) => {
    if (!query.trim()) {
      setState(prev => ({
        ...prev,
        results: [],
        totalCount: 0,
        hasMore: false,
        error: null,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      ...(page === 0 && { results: [] }),
    }));

    setCurrentQuery(query);
    setCurrentFilters(filters);
    setCurrentPage(page);

    try {
      let allResults: SearchResult[] = [];
      let totalCount = 0;

      // Search based on category filter
      if (!filters.category || filters.category === 'all') {
        // Search all categories
        const [courseResults, degreeResults, professorResults] = await Promise.all([
          searchCourses(query, filters, page),
          searchDegrees(query, filters, page),
          searchProfessors(query, filters, page),
        ]);

        allResults = [
          ...courseResults.data,
          ...degreeResults.data,
          ...professorResults.data,
        ];
        totalCount = courseResults.count + degreeResults.count + professorResults.count;
      } else {
        // Search specific category
        switch (filters.category) {
          case 'courses':
            const courseResults = await searchCourses(query, filters, page);
            allResults = courseResults.data;
            totalCount = courseResults.count;
            break;
          case 'degrees':
            const degreeResults = await searchDegrees(query, filters, page);
            allResults = degreeResults.data;
            totalCount = degreeResults.count;
            break;
          case 'professors':
            const professorResults = await searchProfessors(query, filters, page);
            allResults = professorResults.data;
            totalCount = professorResults.count;
            break;
        }
      }

      // Sort by relevance score
      allResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      setState(prev => ({
        ...prev,
        results: page === 0 ? allResults : [...prev.results, ...allResults],
        totalCount,
        hasMore: (page + 1) * ITEMS_PER_PAGE < totalCount,
        isLoading: false,
        error: null,
      }));

      // Add to recent searches if it's a new search
      if (page === 0) {
        addToRecentSearches(query);
      }

    } catch (error) {
      console.error('Search error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al realizar la búsqueda',
      }));
    }
  }, [searchCourses, searchDegrees, searchProfessors]);

  // Search suggestions with debouncing
  const searchWithSuggestions = useCallback(async (query: string): Promise<string[]> => {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      // Get suggestions from course names and tags
      const { data, error } = await supabase
        .from('courses')
        .select('name, tags')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (error) throw error;

      const suggestions = new Set<string>();

      data?.forEach(course => {
        // Add course name if it matches
        if (course.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(course.name);
        }

        // Add relevant tags
        course.tags?.forEach((tag: string) => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(tag);
          }
        });
      });

      return Array.from(suggestions).slice(0, 5);
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }, []);

  // Load more results
  const loadMore = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return;

    await search(currentQuery, currentFilters, currentPage + 1);
  }, [state.isLoading, state.hasMore, currentQuery, currentFilters, currentPage, search]);

  // Recent searches management
  const addToRecentSearches = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setState(prev => {
      const filtered = prev.recentSearches.filter(item =>
        item.toLowerCase() !== trimmedQuery.toLowerCase()
      );
      const newRecentSearches = [trimmedQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      // Save to localStorage
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecentSearches));

      return {
        ...prev,
        recentSearches: newRecentSearches,
      };
    });
  }, []);

  const removeFromRecentSearches = useCallback((query: string) => {
    setState(prev => {
      const newRecentSearches = prev.recentSearches.filter(item =>
        item.toLowerCase() !== query.toLowerCase()
      );

      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecentSearches));

      return {
        ...prev,
        recentSearches: newRecentSearches,
      };
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setState(prev => ({
      ...prev,
      recentSearches: [],
    }));
  }, []);

  // Get popular searches
  const getPopularSearches = useCallback(async (): Promise<string[]> => {
    try {
      // Mock popular searches - in real app, this would come from analytics
      const popular = [
        'Ingeniería de Sistemas',
        'Programación',
        'Matemáticas',
        'Administración',
        'Marketing Digital',
        'Diseño Gráfico',
        'Psicología',
        'Derecho',
      ];

      setState(prev => ({
        ...prev,
        popularSearches: popular,
      }));

      return popular;
    } catch (error) {
      console.error('Popular searches error:', error);
      return [];
    }
  }, []);

  // Clear results
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      results: [],
      totalCount: 0,
      hasMore: false,
      error: null,
    }));
    setCurrentQuery('');
    setCurrentFilters({});
    setCurrentPage(0);
  }, []);

  // Load popular searches on mount
  useEffect(() => {
    getPopularSearches();
  }, [getPopularSearches]);

  return {
    ...state,
    search,
    searchWithSuggestions,
    clearResults,
    loadMore,
    addToRecentSearches,
    removeFromRecentSearches,
    clearRecentSearches,
    getPopularSearches,
  };
};

// Hook for search suggestions with debouncing
export const useSearchSuggestions = (query: string, delay: number = DEBOUNCE_DELAY) => {
  const debouncedQuery = useDebounce(query, delay);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { searchWithSuggestions } = useAdvancedSearch();

  useEffect(() => {
    const getSuggestions = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchWithSuggestions(debouncedQuery);
        setSuggestions(results);
      } catch (error) {
        console.error('Suggestions error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    getSuggestions();
  }, [debouncedQuery, searchWithSuggestions]);

  return {
    suggestions,
    isLoading,
  };
};
