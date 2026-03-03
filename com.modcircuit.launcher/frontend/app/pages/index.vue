<script setup lang="ts">
import { useModpacksStore } from '~/stores/Modpacks'

const modpacksStore = useModpacksStore()
</script>

<template>
  <div class="space-y-8">
    <!-- Featured Modpack Banner -->
    <section v-if="modpacksStore.featured" class="relative overflow-hidden rounded-xl">
      <img
        :src="modpacksStore.featured.image"
        :alt="modpacksStore.featured.name"
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
              Last played: {{ modpacksStore.featured.lastPlayed }}
            </span>
          </div>
          <h2 class="mt-3 font-display text-4xl font-bold text-foreground">
            {{ modpacksStore.featured.name }}
          </h2>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ modpacksStore.featured.mcVersion }} - v{{ modpacksStore.featured.version }}
          </p>
          <p class="mt-3 line-clamp-2 text-muted-foreground">
            {{ modpacksStore.featured.description }}
          </p>
          <div class="mt-4 flex gap-3">
            <button class="btn btn-primary">
              <Icon name="lucide:play" class="h-4 w-4" />
              Continue Playing
            </button>
            <NuxtLink to="/modpacks" class="btn btn-secondary">
              <Icon name="lucide:package" class="h-4 w-4" />
              Browse Modpacks
            </NuxtLink>
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
        <NuxtLink to="/instances" class="text-sm text-primary hover:underline">
          View All
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ModpackCard
          v-for="modpack in modpacksStore.recentlyPlayed"
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
        <NuxtLink to="/modpacks" class="text-sm text-primary hover:underline">
          View All
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ModpackCard
          v-for="modpack in modpacksStore.trending"
          :key="modpack.id"
          :modpack="modpack"
        />
      </div>
    </section>
  </div>
</template>
