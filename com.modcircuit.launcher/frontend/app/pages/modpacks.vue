<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Modpack } from './ModpackCard.vue'

const searchQuery = ref('')
const selectedCategory = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')

const categories = [
  { id: 'all', label: 'All' },
  { id: 'technology', label: 'Technology' },
  { id: 'magic', label: 'Magic' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'survival', label: 'Survival' },
  { id: 'skyblock', label: 'Skyblock' },
  { id: 'creative', label: 'Creative' },
]

const modpacks: Modpack[] = [
  {
    id: '1',
    name: 'TechCraft Ultimate',
    version: '3.2.1',
    mcVersion: '1.20.4',
    author: 'ModCircuit Team',
    description: 'The ultimate technology modpack featuring over 200 mods including Create, Applied Energistics 2, Mekanism, and more.',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBnYW1lfGVufDB8fDB8fHwwhttps://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBnYW1lfGVufDB8fDB8fHww?w=400&h=300&fit=crop',
    downloads: 2500000,
    rating: 4.9,
    tags: ['Technology', 'Automation'],
    installed: true,
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
  },
  {
    id: '4',
    name: 'Arcane Adventures',
    version: '1.5.0',
    mcVersion: '1.20.4',
    author: 'MagicMods',
    description: 'Master the arcane arts with powerful magic mods including Ars Nouveau, Botania, and Thaumcraft.',
    image: 'https://images.unsplash.com/photo-156080770783-91e8fad9978e?w=400&h=300&fit=crop',
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

const filteredModpacks = computed(() => {
  return modpacks.filter((modpack) => {
    const matchesSearch = modpack.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      modpack.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'all' ||
      modpack.tags.some((tag) => tag.toLowerCase() === selectedCategory.value)
    return matchesSearch && matchesCategory
  })
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="font-display text-2xl font-bold text-foreground">
        Browse Modpacks
      </h1>
      <div class="flex items-center gap-2">
        <button
          class="btn h-9 w-9 p-0"
          :class="viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'"
          aria-label="Grid view"
          @click="viewMode = 'grid'"
        >
          <Icon name="lucide:grid-3x3" class="h-4 w-4" />
        </button>
        <button
          class="btn h-9 w-9 p-0"
          :class="viewMode === 'list' ? 'btn-primary' : 'btn-ghost'"
          aria-label="List view"
          @click="viewMode = 'list'"
        >
          <Icon name="lucide:list" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col gap-4 sm:flex-row">
      <div class="relative flex-1">
        <Icon
          name="lucide:search"
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search modpacks..."
          class="input pl-10"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category.id"
          class="btn h-10 px-4 text-sm"
          :class="selectedCategory === category.id ? 'btn-primary' : 'btn-secondary'"
          @click="selectedCategory = category.id"
        >
          {{ category.label }}
        </button>
      </div>
    </div>

    <!-- Results Count -->
    <p class="text-sm text-muted-foreground">
      Showing {{ filteredModpacks.length }} modpacks
    </p>

    <!-- Modpack Grid/List -->
    <div
      :class="{
        'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': viewMode === 'grid',
        'space-y-4': viewMode === 'list',
      }"
    >
      <ModpackCard
        v-for="modpack in filteredModpacks"
        :key="modpack.id"
        :modpack="modpack"
        :variant="viewMode === 'list' ? 'compact' : 'default'"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredModpacks.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <Icon name="lucide:package-x" class="h-16 w-16 text-muted-foreground" />
      <h3 class="mt-4 text-lg font-medium text-foreground">
        No modpacks found
      </h3>
      <p class="mt-2 text-muted-foreground">
        Try adjusting your search or filters
      </p>
    </div>
  </div>
</template>
