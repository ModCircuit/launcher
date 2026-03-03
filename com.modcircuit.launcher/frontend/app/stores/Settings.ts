import { defineStore } from 'pinia'
import {
  GetSettings,
  SaveSettings,
  GetInstancesDir,
  OpenInstancesDir,
} from '~~/wailsjs/go/main/App'
import type { config } from '~~/wailsjs/go/models'

export const RAM_OPTIONS = [2, 4, 6, 8, 10, 12, 14, 16]
export const PING_INTERVAL_OPTIONS = [1, 2, 5, 10, 15, 30, 60]

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    instancesDir: '',
    backendSettings: null as config.Settings | null,
    javaPath: '',
    minRam: 4,
    maxRam: 8,
    pingIntervalMinutes: 5,
    launchOnStartup: false,
    minimizeOnLaunch: true,
    showNotifications: true,
    autoUpdate: true,
    theme: 'dark' as 'dark' | 'light' | 'system',
  }),

  actions: {
    async load() {
      this.instancesDir = await GetInstancesDir()
      const s = await GetSettings()
      this.backendSettings = s
      this.javaPath = s.java?.preferredPath ?? ''
      this.minRam = Math.round((s.java?.minMemoryMb ?? 512) / 1024)
      this.maxRam = Math.round((s.java?.maxMemoryMb ?? 4096) / 1024)
      this.pingIntervalMinutes = s.pingIntervalMinutes ?? 5
    },

    async save() {
      const s: config.Settings = {
        schemaVersion: this.backendSettings?.schemaVersion ?? 1,
        pingIntervalMinutes: this.pingIntervalMinutes,
        java: {
          preferredPath: this.javaPath || undefined,
          maxMemoryMb: this.maxRam * 1024,
          minMemoryMb: this.minRam * 1024,
          extraArgs: this.backendSettings?.java?.extraArgs ?? [],
        },
      }
      await SaveSettings(s)
    },

    async openInstancesDir() {
      await OpenInstancesDir()
    },
  },
})
