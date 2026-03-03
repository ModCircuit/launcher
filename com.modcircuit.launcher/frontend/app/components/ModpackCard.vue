<script setup lang="ts">
import type { Modpack } from '~/stores/Modpacks'

interface Props {
  modpack: Modpack
  variant?: 'default' | 'compact' | 'featured'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const formatDownloads = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const handlePlay = () => {
  console.log('Play modpack:', props.modpack.name)
}

const handleInstall = () => {
  console.log('Install modpack:', props.modpack.name)
}
</script>

<template>
  <article
    class="card group overflow-hidden transition-all hover:border-primary/50"
    :class="{
      'flex gap-4 p-4': variant === 'compact',
    }"
  >
    <!-- Image -->
    <div
      class="relative overflow-hidden"
      :class="{
        'aspect-video': variant === 'default',
        'h-20 w-20 flex-shrink-0 rounded': variant === 'compact',
      }"
    >
      <img
        :src="modpack.image"
        :alt="modpack.name"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div
        v-if="modpack.installed && variant === 'default'"
        class="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground"
      >
        Installed
      </div>
    </div>

    <!-- Content -->
    <div
      :class="{
        'p-4': variant === 'default',
        'flex flex-1 flex-col justify-between': variant === 'compact',
      }"
    >
      <div>
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-display text-lg font-semibold text-foreground">
            {{ modpack.name }}
          </h3>
          <span class="flex-shrink-0 rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {{ modpack.mcVersion }}
          </span>
        </div>
        <p class="mt-1 text-sm text-muted-foreground">
          by {{ modpack.author }}
        </p>
        <p v-if="variant === 'default'" class="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {{ modpack.description }}
        </p>
      </div>

      <!-- Stats and Actions -->
      <div class="mt-3 flex items-center justify-between">
        <div class="flex items-center gap-3 text-sm text-muted-foreground">
          <span class="flex items-center gap-1">
            <Icon name="lucide:download" class="h-4 w-4" />
            {{ formatDownloads(modpack.downloads) }}
          </span>
          <span class="flex items-center gap-1">
            <Icon name="lucide:star" class="h-4 w-4 text-yellow-500" />
            {{ modpack.rating.toFixed(1) }}
          </span>
        </div>
        <button
          v-if="modpack.installed"
          class="btn btn-primary h-8 px-3 text-xs"
          @click="handlePlay"
        >
          <Icon name="lucide:play" class="h-3 w-3" />
          Play
        </button>
        <button
          v-else
          class="btn btn-outline h-8 px-3 text-xs"
          @click="handleInstall"
        >
          <Icon name="lucide:download" class="h-3 w-3" />
          Install
        </button>
      </div>
    </div>
  </article>
</template>
