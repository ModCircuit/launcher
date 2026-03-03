<script setup lang="ts">
import type { Modpack } from './ModpackCard.vue'

type ViewType = 'home' | 'modpacks' | 'downloads' | 'instances' | 'settings' | 'about'

const emit = defineEmits<{
  navigate: [view: ViewType]
}>()

const featuredModpack: Modpack = {
  id: 'featured-1',
  name: 'TechCraft Ultimate',
  version: '3.2.1',
  mcVersion: '1.20.4',
  author: 'ModCircuit Team',
  description: 'The ultimate technology modpack featuring over 200 mods including Create, Applied Energistics 2, Mekanism, and more. Build massive factories, automate everything, and explore new dimensions!',
  image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBnYW1lfGVufDB8fDB8fHwwhttps://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBnYW1lfGVufDB8fDB8fHww?w=1200&h=400&fit=crop',
  downloads: 2500000,
  rating: 4.9,
  tags: ['Technology', 'Automation', 'Popular'],
  installed: true,
  lastPlayed: '2 hours ago',
}

const recentlyPlayed: Modpack[] = [
  {
    id: '1',
    name: 'TechCraft Ultimate',
    version: '3.2.1',
    mcVersion: '1.20.4',
    author: 'ModCircuit Team',
    description: 'The ultimate technology modpack',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBnYW1lfGVufDB8fDB8fHwwhttps://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBnYW1lfGVufDB8fDB8fHww?w=400&h=300&fit=crop',
    downloads: 2500000,
    rating: 4.9,
    tags: ['Technology'],
    installed: true,
    lastPlayed: '2 hours ago',
  },
  {
    id: '2',
    name: 'Medieval Kingdoms',
    version: '2.1.0',
    mcVersion: '1.20.4',
    author: 'HistoryCraft',
    description: 'Build your medieval empire',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop',
    downloads: 890000,
    rating: 4.7,
    tags: ['Adventure'],
    installed: true,
    lastPlayed: '1 day ago',
  },
  {
    id: '3',
    name: 'SkyFactory 5',
    version: '5.0.3',
    mcVersion: '1.20.1',
    author: 'Darkosto',
    description: 'Start from nothing in the sky',
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&h=300&fit=crop',
    downloads: 3200000,
    rating: 4.8,
    tags: ['Skyblock'],
    installed: true,
    lastPlayed: '3 days ago',
  },
]

const trendingModpacks: Modpack[] = [
  {
    id: '4',
    name: 'Arcane Adventures',
    version: '1.5.0',
    mcVersion: '1.20.4',
    author: 'MagicMods',
    description: 'Master the arcane arts with powerful magic mods',
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
    description: 'Enhanced survival with realistic mechanics',
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
    description: 'Everything you need for amazing builds',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=300&fit=crop',
    downloads: 620000,
    rating: 4.7,
    tags: ['Creative', 'Building'],
  },
]

const handlePlayFeatured = () => {
  console.log('Play featured modpack')
}
</script>

<template>
  <div class="space-y-8">
    <!-- Featured Modpack Banner -->
    <section class="relative overflow-hidden rounded-xl">
      <img
        :src="featuredModpack.image"
        :alt="featuredModpack.name"
        class="h-64 w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      <div class="absolute inset-0 flex items-center p-8">
        <div class="max-w-xl">
          <div class="flex items-center gap-2">
            <span class="rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              FEATURED
            </span>
            <span class="text-sm text-muted-foreground">
              Last played: {{ featuredModpack.lastPlayed }}
            </span>
          </div>
          <h2 class="mt-3 font-display text-4xl font-bold text-foreground">
            {{ featuredModpack.name }}
          </h2>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ featuredModpack.mcVersion }} - v{{ featuredModpack.version }}
          </p>
          <p class="mt-3 line-clamp-2 text-muted-foreground">
            {{ featuredModpack.description }}
          </p>
          <div class="mt-4 flex gap-3">
            <button class="btn btn-primary" @click="handlePlayFeatured">
              <Icon name="lucide:play" class="h-4 w-4" />
              Continue Playing
            </button>
            <button class="btn btn-secondary" @click="emit('navigate', 'modpacks')">
              <Icon name="lucide:package" class="h-4 w-4" />
              Browse Modpacks
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Recently Played -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="font-display text-xl font-semibold text-foreground">
          Recently Played
        </h2>
        <button
          class="text-sm text-primary hover:underline"
          @click="emit('navigate', 'instances')"
        >
          View All
        </button>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ModpackCard
          v-for="modpack in recentlyPlayed"
          :key="modpack.id"
          :modpack="modpack"
        />
      </div>
    </section>

    <!-- Trending Modpacks -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="font-display text-xl font-semibold text-foreground">
          Trending Modpacks
        </h2>
        <button
          class="text-sm text-primary hover:underline"
          @click="emit('navigate', 'modpacks')"
        >
          View All
        </button>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ModpackCard
          v-for="modpack in trendingModpacks"
          :key="modpack.id"
          :modpack="modpack"
        />
      </div>
    </section>
  </div>
</template>
