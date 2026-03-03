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

        getStatus:
            (state) =>
            (id: string): RepositoryStatus | null =>
                state.status[id] ?? null,
    },

    actions: {
        // -----------------------------------------------------------------------
        // Initialization
        // -----------------------------------------------------------------------

        async init() {
            if (this.initialized) return

            this.bindStatusEvents()
            await this.loadRepositories()
            // Ping asynchronously — don't block page load
            PingAll().catch(() => {})

            this.initialized = true
        },

        // -----------------------------------------------------------------------
        // Data loading
        // -----------------------------------------------------------------------

        async loadRepositories() {
            this.repositories = (await ListRepositories()) ?? []
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
            // Ping immediately after adding
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
            await this.updateRepository(
                id,
                repo.name,
                repo.url,
                repo.description,
                !repo.enabled,
                repo.priority,
            )
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
            EventsOn('repository:status', (payload: RepositoryStatus) => {
                this.status[payload.id] = payload
            })
        },
    },
})