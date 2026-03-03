import { defineStore } from 'pinia'
import { EventsOn } from '~~/wailsjs/runtime/runtime'
import {
    ListRepositories,
    AddRepository,
    UpdateRepository,
    RemoveRepository,
    PingAll,
    PingRepository,
} from '~~/wailsjs/go/main/App'
import type { repository } from '~~/wailsjs/go/models'

export type Repository = repository.Repository

export interface RepositoryStatus {
    id: string
    online: boolean
    error?: string
    checkedAt: string
}

/**
 * Wait for the Wails IPC bridge (window.go) to be injected.
 * In dev mode the bridge is set up asynchronously via WebSocket,
 * so it may not exist yet when Vue mounts. Polls every 50 ms.
 */
function waitForWails(timeoutMs = 10_000): Promise<void> {
    return new Promise((resolve, reject) => {
        if ((window as any).go) { resolve(); return }
        const deadline = Date.now() + timeoutMs
        const id = setInterval(() => {
            if ((window as any).go) {
                clearInterval(id)
                resolve()
            } else if (Date.now() >= deadline) {
                clearInterval(id)
                reject(new Error('Wails runtime did not initialise in time'))
            }
        }, 50)
    })
}

export const useRepositoryStore = defineStore('repositories', {
    state: () => ({
        repositories: [] as Repository[],
        status: {} as Record<string, RepositoryStatus>,
        initialized: false,
    }),

    getters: {
        sortedRepositories(state): Repository[] {
            return [...state.repositories].sort((a, b) => a.priority - b.priority)
        },
    },

    actions: {
        // -----------------------------------------------------------------------
        // Initialization
        // -----------------------------------------------------------------------

        async init() {
            if (this.initialized) return

            await waitForWails()
            await this.loadRepositories()
            this.bindStatusEvents()
            PingAll().catch(() => {})

            this.initialized = true
        },

        // -----------------------------------------------------------------------
        // Data loading
        // -----------------------------------------------------------------------

        async loadRepositories() {
            const result = await ListRepositories()
            this.repositories = Array.isArray(result) ? result : []
        },

        // -----------------------------------------------------------------------
        // CRUD
        // -----------------------------------------------------------------------

        async addRepository(
            name: string,
            url: string,
            description: string,
            enabled: boolean,
            priority: number = 0,
        ): Promise<Repository> {
            const repo = await AddRepository(name, url, description, enabled, priority)
            this.repositories.push(repo)
            PingRepository(repo.id).catch(() => {})
            return repo
        },

        async updateRepository(
            id: string,
            name: string,
            url: string,
            description: string,
            enabled: boolean,
            priority: number,
        ): Promise<void> {
            await UpdateRepository(id, name, url, description, enabled, priority)
            const idx = this.repositories.findIndex((r) => r.id === id)
            if (idx !== -1) {
                this.repositories.splice(idx, 1, { id, name, url, description, enabled, priority })
            }
        },

        async removeRepository(id: string): Promise<void> {
            await RemoveRepository(id)
            this.repositories = this.repositories.filter((r) => r.id !== id)
            delete this.status[id]
        },

        async toggleRepository(id: string): Promise<void> {
            const repo = this.repositories.find((r) => r.id === id)
            if (!repo) return
            await this.updateRepository(id, repo.name, repo.url, repo.description, !repo.enabled, repo.priority)
        },

        async pingRepository(id: string): Promise<void> {
            await PingRepository(id)
        },

        async pingAll(): Promise<void> {
            await PingAll()
        },

        // -----------------------------------------------------------------------
        // Status events
        // -----------------------------------------------------------------------

        bindStatusEvents() {
            try {
                EventsOn('repository:status', (payload: RepositoryStatus) => {
                    this.status[payload.id] = payload
                })
            } catch (e) {
                console.warn('[repositories] EventsOn unavailable, retrying in 1s:', e)
                setTimeout(() => {
                    try {
                        EventsOn('repository:status', (payload: RepositoryStatus) => {
                            this.status[payload.id] = payload
                        })
                    } catch (e2) {
                        console.warn('[repositories] EventsOn failed permanently:', e2)
                    }
                }, 1000)
            }
        },
    },
})
