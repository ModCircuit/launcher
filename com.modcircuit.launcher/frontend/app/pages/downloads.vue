<script setup lang="ts">
import { useDownloadsStore } from '~/stores/Downloads'
import type { Download } from '~/stores/Downloads'

const store = useDownloadsStore()

const getStatusColor = (status: Download['status']) => {
  switch (status) {
    case 'downloading': return 'text-primary'
    case 'paused':      return 'text-yellow-500'
    case 'completed':   return 'text-green-500'
    case 'error':       return 'text-accent'
    default:            return 'text-muted-foreground'
  }
}

const getStatusIcon = (status: Download['status']) => {
  switch (status) {
    case 'downloading': return 'lucide:download'
    case 'paused':      return 'lucide:pause'
    case 'completed':   return 'lucide:check-circle'
    case 'error':       return 'lucide:alert-circle'
    default:            return 'lucide:circle'
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl font-bold text-foreground">
        Downloads
      </h1>
    </div>

    <!-- Active Downloads -->
    <section>
      <h2 class="mb-4 font-display text-lg font-semibold text-foreground">
        Active Downloads
      </h2>
      <div v-if="store.active.length > 0" class="space-y-4">
        <div
          v-for="download in store.active"
          :key="download.id"
          class="card p-4"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <Icon
                  :name="getStatusIcon(download.status)"
                  :class="['h-5 w-5', getStatusColor(download.status)]"
                />
                <h3 class="font-medium text-foreground">
                  {{ download.name }}
                </h3>
                <span class="text-sm text-muted-foreground">
                  v{{ download.version }}
                </span>
              </div>
              <div class="mt-3">
                <div class="mb-1 flex justify-between text-sm text-muted-foreground">
                  <span>{{ download.downloaded }} / {{ download.size }}</span>
                  <span v-if="download.status === 'downloading'">
                    {{ download.speed }}
                  </span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    class="h-full rounded-full bg-primary transition-all"
                    :style="{ width: `${download.progress}%` }"
                  />
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="btn btn-ghost h-9 w-9 p-0"
                :aria-label="download.status === 'paused' ? 'Resume' : 'Pause'"
                @click="store.togglePause(download.id)"
              >
                <Icon
                  :name="download.status === 'paused' ? 'lucide:play' : 'lucide:pause'"
                  class="h-4 w-4"
                />
              </button>
              <button
                class="btn btn-ghost h-9 w-9 p-0 text-accent hover:bg-accent/10"
                aria-label="Cancel"
                @click="store.cancel(download.id)"
              >
                <Icon name="lucide:x" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="card flex flex-col items-center justify-center py-12 text-center"
      >
        <Icon name="lucide:download" class="h-12 w-12 text-muted-foreground" />
        <p class="mt-4 text-muted-foreground">
          No active downloads
        </p>
      </div>
    </section>

    <!-- Download History -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="font-display text-lg font-semibold text-foreground">
          Download History
        </h2>
        <button
          v-if="store.history.length > 0"
          class="text-sm text-primary hover:underline"
          @click="store.clearHistory()"
        >
          Clear History
        </button>
      </div>
      <div v-if="store.history.length > 0" class="space-y-2">
        <div
          v-for="download in store.history"
          :key="download.id"
          class="card flex items-center justify-between p-4"
        >
          <div class="flex items-center gap-3">
            <Icon
              :name="getStatusIcon(download.status)"
              :class="['h-5 w-5', getStatusColor(download.status)]"
            />
            <div>
              <h3 class="font-medium text-foreground">
                {{ download.name }}
              </h3>
              <p class="text-sm text-muted-foreground">
                v{{ download.version }} - {{ download.size }}
              </p>
            </div>
          </div>
          <button class="btn btn-ghost h-9 w-9 p-0" aria-label="Remove">
            <Icon name="lucide:trash-2" class="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        v-else
        class="card flex flex-col items-center justify-center py-12 text-center"
      >
        <Icon name="lucide:history" class="h-12 w-12 text-muted-foreground" />
        <p class="mt-4 text-muted-foreground">
          No download history
        </p>
      </div>
    </section>
  </div>
</template>
