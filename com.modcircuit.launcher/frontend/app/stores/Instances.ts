import { defineStore } from 'pinia'

export interface Instance {
  id: string
  name: string
  version: string
  mcVersion: string
  lastPlayed: string
  playTime: string
  size: string
  image: string
}

export const useInstancesStore = defineStore('instances', {
  state: () => ({
    instances: [
      {
        id: '1',
        name: 'TechCraft Ultimate',
        version: '3.2.1',
        mcVersion: '1.20.4',
        lastPlayed: '2 hours ago',
        playTime: '124h 32m',
        size: '2.4 GB',
        image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=200&fit=crop',
      },
      {
        id: '2',
        name: 'Medieval Kingdoms',
        version: '2.1.0',
        mcVersion: '1.20.4',
        lastPlayed: '1 day ago',
        playTime: '56h 18m',
        size: '1.8 GB',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&h=200&fit=crop',
      },
      {
        id: '3',
        name: 'SkyFactory 5',
        version: '5.0.3',
        mcVersion: '1.20.1',
        lastPlayed: '3 days ago',
        playTime: '89h 45m',
        size: '3.1 GB',
        image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=200&h=200&fit=crop',
      },
    ] as Instance[],
  }),

  getters: {
    totalStorage(state): string {
      const total = state.instances.reduce(
        (acc, inst) => acc + parseFloat(inst.size.replace(' GB', '')),
        0,
      )
      return total.toFixed(1)
    },
  },

  actions: {
    play(id: string) {
      console.log('Play instance:', id)
    },

    remove(id: string) {
      this.instances = this.instances.filter((i) => i.id !== id)
    },
  },
})
