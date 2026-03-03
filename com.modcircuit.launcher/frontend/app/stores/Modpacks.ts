import { defineStore } from 'pinia'

export interface Modpack {
  id: string
  name: string
  version: string
  mcVersion: string
  author: string
  description: string
  image: string
  downloads: number
  rating: number
  tags: string[]
  installed?: boolean
  lastPlayed?: string
}

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'technology', label: 'Technology' },
  { id: 'magic', label: 'Magic' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'survival', label: 'Survival' },
  { id: 'skyblock', label: 'Skyblock' },
  { id: 'creative', label: 'Creative' },
]

const MODPACKS: Modpack[] = [
  {
    id: '1',
    name: 'TechCraft Ultimate',
    version: '3.2.1',
    mcVersion: '1.20.4',
    author: 'ModCircuit Team',
    description: 'The ultimate technology modpack featuring over 200 mods including Create, Applied Energistics 2, Mekanism, and more. Build massive factories, automate everything, and explore new dimensions!',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&auto=format&fit=crop&q=60',
    downloads: 2500000,
    rating: 4.9,
    tags: ['Technology', 'Automation', 'Popular'],
    installed: true,
    lastPlayed: '2 hours ago',
  },
  {
    id: '2',
    name: 'Medieval Kingdoms',
    version: '2.1.0',
    mcVersion: '1.20.4',
    author: 'HistoryCraft',
    description: 'Build your medieval empire with castles, villages, and conquer neighboring kingdoms.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop',
    downloads: 890000,
    rating: 4.7,
    tags: ['Adventure', 'RPG'],
    installed: true,
    lastPlayed: '1 day ago',
  },
  {
    id: '3',
    name: 'SkyFactory 5',
    version: '5.0.3',
    mcVersion: '1.20.1',
    author: 'Darkosto',
    description: 'Start from nothing but a tree and expand your sky island into a massive factory.',
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&h=300&fit=crop',
    downloads: 3200000,
    rating: 4.8,
    tags: ['Skyblock', 'Technology'],
    installed: true,
    lastPlayed: '3 days ago',
  },
  {
    id: '4',
    name: 'Arcane Adventures',
    version: '1.5.0',
    mcVersion: '1.20.4',
    author: 'MagicMods',
    description: 'Master the arcane arts with powerful magic mods including Ars Nouveau, Botania, and Thaumcraft.',
    image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=300&fit=crop',
    downloads: 450000,
    rating: 4.6,
    tags: ['Magic', 'Adventure'],
  },
  {
    id: '5',
    name: 'Survival Plus',
    version: '4.2.0',
    mcVersion: '1.20.4',
    author: 'HardcoreTeam',
    description: 'Enhanced survival experience with realistic mechanics, seasons, and challenging gameplay.',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=300&fit=crop',
    downloads: 780000,
    rating: 4.5,
    tags: ['Survival', 'Hardcore'],
  },
  {
    id: '6',
    name: 'Creative Builders',
    version: '2.0.1',
    mcVersion: '1.20.4',
    author: 'BuildTeam',
    description: 'Everything you need for amazing builds including Chisel, WorldEdit, and decorative mods.',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=300&fit=crop',
    downloads: 620000,
    rating: 4.7,
    tags: ['Creative', 'Building'],
  },
  {
    id: '7',
    name: 'Pixelmon Reborn',
    version: '9.1.2',
    mcVersion: '1.20.4',
    author: 'Pixelmon Team',
    description: 'Catch, train, and battle Pokemon in Minecraft with this comprehensive Pixelmon modpack.',
    image: 'https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=400&h=300&fit=crop',
    downloads: 4100000,
    rating: 4.9,
    tags: ['Adventure', 'Pokemon'],
  },
  {
    id: '8',
    name: 'Space Explorers',
    version: '1.8.0',
    mcVersion: '1.20.4',
    author: 'GalacticMods',
    description: 'Explore the cosmos with advanced rockets, space stations, and alien planets.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop',
    downloads: 520000,
    rating: 4.4,
    tags: ['Technology', 'Space'],
  },
]

export const useModpacksStore = defineStore('modpacks', {
  state: () => ({
    modpacks: MODPACKS as Modpack[],
    searchQuery: '',
    selectedCategory: 'all',
    viewMode: 'grid' as 'grid' | 'list',
  }),

  getters: {
    filtered(state): Modpack[] {
      return state.modpacks.filter((m) => {
        const q = state.searchQuery.toLowerCase()
        const matchesSearch =
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
        const matchesCategory =
          state.selectedCategory === 'all' ||
          m.tags.some((t) => t.toLowerCase() === state.selectedCategory)
        return matchesSearch && matchesCategory
      })
    },

    featured(state): Modpack | null {
      return state.modpacks.find((m) => m.installed && m.lastPlayed) ?? null
    },

    recentlyPlayed(state): Modpack[] {
      return state.modpacks
        .filter((m) => m.installed && m.lastPlayed)
        .slice(0, 3)
    },

    trending(state): Modpack[] {
      return state.modpacks
        .filter((m) => !m.installed)
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 3)
    },
  },

  actions: {
    install(id: string) {
      const m = this.modpacks.find((m) => m.id === id)
      if (m) m.installed = true
    },
  },
})
