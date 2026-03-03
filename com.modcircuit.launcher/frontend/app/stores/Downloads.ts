import { defineStore } from 'pinia'

export interface Download {
  id: string
  name: string
  version: string
  progress: number
  speed: string
  status: 'downloading' | 'paused' | 'completed' | 'error'
  size: string
  downloaded: string
}

export const useDownloadsStore = defineStore('downloads', {
  state: () => ({
    active: [
      {
        id: '1',
        name: 'TechCraft Ultimate',
        version: '3.2.1',
        progress: 67,
        speed: '12.4 MB/s',
        status: 'downloading' as const,
        size: '1.2 GB',
        downloaded: '804 MB',
      },
      {
        id: '2',
        name: 'Medieval Kingdoms',
        version: '2.1.0',
        progress: 23,
        speed: '0 B/s',
        status: 'paused' as const,
        size: '856 MB',
        downloaded: '197 MB',
      },
    ] as Download[],
    history: [
      {
        id: '3',
        name: 'SkyFactory 5',
        version: '5.0.3',
        progress: 100,
        speed: '',
        status: 'completed' as const,
        size: '1.5 GB',
        downloaded: '1.5 GB',
      },
      {
        id: '4',
        name: 'Arcane Adventures',
        version: '1.5.0',
        progress: 100,
        speed: '',
        status: 'completed' as const,
        size: '920 MB',
        downloaded: '920 MB',
      },
    ] as Download[],
  }),

  actions: {
    togglePause(id: string) {
      const d = this.active.find((d) => d.id === id)
      if (!d) return
      if (d.status === 'downloading') {
        d.status = 'paused'
        d.speed = '0 B/s'
      } else if (d.status === 'paused') {
        d.status = 'downloading'
        d.speed = '12.4 MB/s'
      }
    },

    cancel(id: string) {
      this.active = this.active.filter((d) => d.id !== id)
    },

    clearHistory() {
      this.history = []
    },
  },
})
