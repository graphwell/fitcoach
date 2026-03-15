import { Food } from '@/store/useStore';

const USER_AGENT = 'FitCoachApp/1.0 (contact: somar.ia@example.com)';

export interface OpenFoodFactsProduct {
  product_name?: string;
  brands?: string;
  image_url?: string;
  image_front_url?: string;
  nutriscore_grade?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'energy-kcal_serving'?: number;
    proteins_100g?: number;
    proteins_serving?: number;
    carbohydrates_100g?: number;
    carbohydrates_serving?: number;
    fat_100g?: number;
    fat_serving?: number;
    [key: string]: any;
  };
  serving_size?: string;
}

const CACHE_KEY = 'fitcoach_product_cache';

const getCache = (): Record<string, Food> => {
  if (typeof window === 'undefined') return {};
  const saved = localStorage.getItem(CACHE_KEY);
  return saved ? JSON.parse(saved) : {};
};

const saveToCache = (barcode: string, food: Food) => {
  if (typeof window === 'undefined') return;
  const cache = getCache();
  cache[barcode] = food;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

const mapToFood = (p: OpenFoodFactsProduct): Food => {
  const protein = p.nutriments?.proteins_serving ?? p.nutriments?.proteins_100g ?? 0;
  const carbs = p.nutriments?.carbohydrates_serving ?? p.nutriments?.carbohydrates_100g ?? 0;
  const fat = p.nutriments?.fat_serving ?? p.nutriments?.fat_100g ?? 0;
  const calories = p.nutriments?.['energy-kcal_serving'] ?? p.nutriments?.['energy-kcal_100g'] ?? 0;

  return {
    name: p.product_name || 'Produto Desconhecido',
    amount: p.serving_size || '100g',
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    calories: Math.round(calories),
    imageUrl: p.image_url || p.image_front_url,
    brand: p.brands,
    nutriscore: p.nutriscore_grade?.toUpperCase()
  };
};

export const fetchProductByBarcode = async (barcode: string): Promise<Food | null> => {
  try {
    const cache = getCache();
    if (cache[barcode]) return cache[barcode];

    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
      headers: { 'User-Agent': USER_AGENT }
    });
    const data = await response.json();

    if (data.status === 1 && data.product) {
      const food = mapToFood(data.product);
      saveToCache(barcode, food);
      return food;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const searchProducts = async (query: string, page: number = 1): Promise<{ foods: Food[], totalPages: number }> => {
  try {
    // Se a query estiver vazia, sugerir alimentos básicos brasileiros
    const effectiveQuery = query || 'Arroz, Feijão, Ovo, Frango, Banana, Leite';
    const sortBy = query ? 'popularity' : 'unique_scans_n';
    const searchTerms = `&search_terms=${encodeURIComponent(effectiveQuery)}`;
    
    // Adicionado cc=br para priorizar produtos brasileiros e lc=pt para nomes em português
    const url = `https://world.openfoodfacts.org/api/v2/search?${searchTerms}&page=${page}&page_size=20&cc=br&lc=pt&fields=code,product_name,brands,image_front_url,nutriscore_grade,nutriments.energy-kcal_100g,nutriments.fat_100g,nutriments.carbohydrates_100g,nutriments.proteins_100g,serving_size&sort_by=${sortBy}&json=1`;

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT }
    });
    const data = await response.json();

    const foods = (data.products || []).map((p: OpenFoodFactsProduct) => mapToFood(p));
    const totalPages = Math.ceil((data.count || 0) / 20);

    return { foods, totalPages };
  } catch (error) {
    console.error('Error searching products:', error);
    return { foods: [], totalPages: 0 };
  }
};
