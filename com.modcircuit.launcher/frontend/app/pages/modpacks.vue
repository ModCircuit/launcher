<script setup lang="ts">
import { useModpacksStore, CATEGORIES } from '~/stores/Modpacks'

const store = useModpacksStore()
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
          :class="store.viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'"
          aria-label="Grid view"
          @click="store.viewMode = 'grid'"
        >
          <Icon name="lucide:grid-3x3" class="h-4 w-4" />
        </button>
        <button
          class="btn h-9 w-9 p-0"
          :class="store.viewMode === 'list' ? 'btn-primary' : 'btn-ghost'"
          aria-label="List view"
          @click="store.viewMode = 'list'"
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
          v-model="store.searchQuery"
          type="text"
          placeholder="Search modpacks..."
          class="input pl-10"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in CATEGORIES"
          :key="category.id"
          class="btn h-10 px-4 text-sm"
          :class="store.selectedCategory === category.id ? 'btn-primary' : 'btn-secondary'"
          @click="store.selectedCategory = category.id"
        >
          {{ category.label }}
        </button>
      </div>
    </div>

    <!-- Results Count -->
    <p class="text-sm text-muted-foreground">
      Showing {{ store.filtered.length }} modpacks
    </p>

    <!-- Modpack Grid/List -->
    <div
      :class="{
        'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': store.viewMode === 'grid',
        'space-y-4': store.viewMode === 'list',
      }"
    >
      <ModpackCard
        v-for="modpack in store.filtered"
        :key="modpack.id"
        :modpack="modpack"
        :variant="store.viewMode === 'list' ? 'compact' : 'default'"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="store.filtered.length === 0"
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
