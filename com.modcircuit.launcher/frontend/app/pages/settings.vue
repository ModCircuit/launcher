<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore, RAM_OPTIONS, PING_INTERVAL_OPTIONS } from '~/stores/Settings'

const store = useSettingsStore()

onMounted(() => store.load())
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8">
    <!-- Header -->
    <div>
      <h1 class="font-display text-2xl font-bold text-foreground">
        Settings
      </h1>
      <p class="mt-1 text-muted-foreground">
        Configure your launcher preferences
      </p>
    </div>

    <!-- Java Settings -->
    <section class="card p-6">
      <h2 class="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Icon name="lucide:coffee" class="h-5 w-5 text-primary" />
        Java Settings
      </h2>
      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-foreground">
            Java Path
          </label>
          <div class="flex gap-2">
            <input v-model="store.javaPath" type="text" class="input flex-1" />
            <button class="btn btn-secondary">Browse</button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-foreground">
              Minimum RAM (GB)
            </label>
            <select v-model="store.minRam" class="input">
              <option v-for="ram in RAM_OPTIONS" :key="ram" :value="ram">
                {{ ram }} GB
              </option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-foreground">
              Maximum RAM (GB)
            </label>
            <select v-model="store.maxRam" class="input">
              <option v-for="ram in RAM_OPTIONS" :key="ram" :value="ram">
                {{ ram }} GB
              </option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Storage Settings -->
    <section class="card p-6">
      <h2 class="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Icon name="lucide:folder" class="h-5 w-5 text-primary" />
        Storage
      </h2>
      <div>
        <label class="mb-2 block text-sm font-medium text-foreground">
          Instances Folder
        </label>
        <div class="flex gap-2">
          <input v-model="store.instancesDir" type="text" disabled class="input flex-1" />
          <button class="btn btn-secondary" @click="store.openInstancesDir()">Browse</button>
        </div>
      </div>
    </section>

    <!-- Launcher Settings -->
    <section class="card p-6">
      <h2 class="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Icon name="lucide:settings" class="h-5 w-5 text-primary" />
        Launcher
      </h2>
      <div class="space-y-4">
        <label
          v-for="[key, label] in ([
            ['launchOnStartup', 'Launch on system startup'],
            ['minimizeOnLaunch', 'Minimize when launching game'],
            ['showNotifications', 'Show notifications'],
            ['autoUpdate', 'Auto-update launcher'],
          ] as [keyof typeof store, string][])"
          :key="key"
          class="flex items-center justify-between"
        >
          <span class="text-sm text-foreground">{{ label }}</span>
          <button
            class="relative h-6 w-11 rounded-full transition-colors"
            :class="store[key] ? 'bg-primary' : 'bg-secondary'"
            role="switch"
            :aria-checked="String(store[key])"
            @click="(store[key] as boolean) = !(store[key] as boolean)"
          >
            <span
              class="absolute top-1 h-4 w-4 rounded-full bg-white transition-transform"
              :class="store[key] ? 'left-6' : 'left-1'"
            />
          </button>
        </label>
      </div>
    </section>

    <!-- Repository Settings -->
    <section class="card p-6">
      <h2 class="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Icon name="lucide:database" class="h-5 w-5 text-primary" />
        Repositories
      </h2>
      <div>
        <label class="mb-2 block text-sm font-medium text-foreground">
          Ping Interval
        </label>
        <select v-model="store.pingIntervalMinutes" class="input">
          <option v-for="n in PING_INTERVAL_OPTIONS" :key="n" :value="n">
            Every {{ n }} {{ n === 1 ? 'minute' : 'minutes' }}
          </option>
        </select>
        <p class="mt-1 text-xs text-muted-foreground">
          How often the launcher checks repository availability in the background
        </p>
      </div>
    </section>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button class="btn btn-primary" @click="store.save()">
        Save Settings
      </button>
    </div>
  </div>
</template>
