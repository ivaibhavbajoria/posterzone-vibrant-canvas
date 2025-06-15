
export interface LocalPoster {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_trending: boolean;
  is_best_seller: boolean;
  created_at: string;
}

export interface LocalCategory {
  id: string;
  name: string;
  description?: string;
}

class LocalStorageService {
  private POSTERS_KEY = 'posterzone_posters';
  private CATEGORIES_KEY = 'posterzone_categories';

  // Initialize with default data if empty
  initializeData() {
    if (!this.getPosters().length) {
      this.setPosters([]);
    }
    
    if (!this.getCategories().length) {
      const defaultCategories: LocalCategory[] = [
        { id: '1', name: 'Abstract', description: 'Modern abstract art' },
        { id: '2', name: 'Nature', description: 'Beautiful nature scenes' },
        { id: '3', name: 'Minimalist', description: 'Clean and simple designs' },
        { id: '4', name: 'Vintage', description: 'Classic retro posters' },
        { id: '5', name: 'Photography', description: 'Stunning photography prints' }
      ];
      this.setCategories(defaultCategories);
    }
  }

  // Poster methods
  getPosters(): LocalPoster[] {
    const stored = localStorage.getItem(this.POSTERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  setPosters(posters: LocalPoster[]) {
    localStorage.setItem(this.POSTERS_KEY, JSON.stringify(posters));
  }

  addPoster(poster: Omit<LocalPoster, 'id' | 'created_at'>): LocalPoster {
    const newPoster: LocalPoster = {
      ...poster,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    
    const posters = this.getPosters();
    posters.unshift(newPoster);
    this.setPosters(posters);
    return newPoster;
  }

  updatePoster(id: string, updates: Partial<LocalPoster>): LocalPoster | null {
    const posters = this.getPosters();
    const index = posters.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    posters[index] = { ...posters[index], ...updates };
    this.setPosters(posters);
    return posters[index];
  }

  deletePoster(id: string): boolean {
    const posters = this.getPosters();
    const filteredPosters = posters.filter(p => p.id !== id);
    
    if (filteredPosters.length === posters.length) return false;
    
    this.setPosters(filteredPosters);
    return true;
  }

  // Category methods
  getCategories(): LocalCategory[] {
    const stored = localStorage.getItem(this.CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  setCategories(categories: LocalCategory[]) {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
  }
}

export const localStorageService = new LocalStorageService();
