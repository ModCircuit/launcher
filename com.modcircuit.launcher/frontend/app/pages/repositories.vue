<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRepositoryStore } from '~/stores/Repositories'
import type { Repository, RepositoryStatus } from '~/stores/Repositories'

const repoStore = useRepositoryStore()

const loading = ref(true)
const initError = ref('')
const searchQuery = ref('')
const drawerOpen = ref(false)
const editingRepo = ref<Repository | null>(null)
const saving = ref(false)
const saveError = ref('')
const PING_MIN_MS = 600

const pinging = ref<Record<string, boolean>>({})
// Derived: true while any individual repo spinner is still active
const pingingAll: ComputedRef<boolean> = computed(() =>
  Object.values(pinging.value).some(Boolean),
)

// Per-id start timestamps and scheduled clear timers
const pingStartTimes: Record<string, number> = {}
const pingTimers: Record<string, ReturnType<typeof setTimeout>> = {}

const startPinging = (id: string) => {
  pingStartTimes[id] = Date.now()
  pinging.value[id] = true
}

// Clears spinner after the remaining minimum display time
const stopPinging = (id: string) => {
  if (pingTimers[id]) clearTimeout(pingTimers[id])
  const elapsed = Date.now() - (pingStartTimes[id] ?? 0)
  pingTimers[id] = setTimeout(() => {
    pinging.value[id] = false
    delete pingTimers[id]
  }, Math.max(0, PING_MIN_MS - elapsed))
}

// When a status event arrives, trigger the debounced clear
watch(
  () => repoStore.status,
  (status) => {
    for (const id of Object.keys(status)) {
      if (pinging.value[id]) stopPinging(id)
    }
  },
  { deep: true },
)

const formData = ref({
  name: '',
  url: '',
  description: '',
  enabled: true,
  priority: 0,
})

onMounted(async () => {
  try {
    await repoStore.init()
  } catch (e) {
    initError.value = e instanceof Error ? e.message : String(e)
    console.error('[repositories] init failed:', e)
  } finally {
    loading.value = false
  }
})

const filteredRepositories = computed(() => {
  if (!searchQuery.value) return repoStore.sortedRepositories
  const q = searchQuery.value.toLowerCase()
  return repoStore.sortedRepositories.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.url.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q),
  )
})

const openCreateDrawer = () => {
  editingRepo.value = null
  saveError.value = ''
  formData.value = { name: '', url: '', description: '', enabled: true, priority: 0 }
  drawerOpen.value = true
}

const openEditDrawer = (repo: Repository) => {
  editingRepo.value = repo
  saveError.value = ''
  formData.value = {
    name: repo.name,
    url: repo.url,
    description: repo.description,
    enabled: repo.enabled,
    priority: repo.priority,
  }
  drawerOpen.value = true
}

const closeDrawer = () => {
  drawerOpen.value = false
  editingRepo.value = null
  saveError.value = ''
}

const saveRepository = async () => {
  saving.value = true
  saveError.value = ''
  try {
    if (editingRepo.value) {
      await repoStore.updateRepository(
        editingRepo.value.id,
        formData.value.name,
        formData.value.url,
        formData.value.description,
        formData.value.enabled,
        formData.value.priority,
      )
    } else {
      await repoStore.addRepository(
        formData.value.name,
        formData.value.url,
        formData.value.description,
        formData.value.enabled,
        formData.value.priority,
      )
    }
    closeDrawer()
  } catch (e) {
    saveError.value = e instanceof Error ? e.message : 'Failed to save repository'
  } finally {
    saving.value = false
  }
}

const deleteRepository = async (id: string) => {
  await repoStore.removeRepository(id)
}

const toggleRepository = async (id: string) => {
  await repoStore.toggleRepository(id)
}

const pingRepository = async (id: string) => {
  startPinging(id)
  // Fallback: force-clear after 6s if no status event ever arrives
  setTimeout(() => stopPinging(id), 6000)
  await repoStore.pingRepository(id).catch(() => {})
}

const pingAll = async () => {
  for (const repo of repoStore.repositories.filter((r) => r.enabled)) startPinging(repo.id)
  setTimeout(() => {
    for (const id of Object.keys(pinging.value)) {
      if (pinging.value[id]) stopPinging(id)
    }
  }, 6000)
  await repoStore.pingAll().catch(() => {})
}

// Access status directly from store state for proper reactivity
const getStatus = (id: string): RepositoryStatus | null => repoStore.status[id] ?? null

const statusColor = (id: string) => {
  const s = getStatus(id)
  if (!s) return 'bg-muted-foreground/40'
  return s.online ? 'bg-green-500' : 'bg-destructive'
}

const statusText = (id: string) => {
  const s = getStatus(id)
  if (!s) return 'Unknown'
  return s.online ? 'Online' : 'Offline'
}

const statusBadgeClass = (id: string) => {
  const s = getStatus(id)
  if (!s) return 'bg-muted text-muted-foreground'
  return s.online ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Repositories</h1>
        <p class="text-sm text-muted-foreground">Manage modpack sources and repositories</p>
      </div>
      <div class="flex gap-2">
        <button
          class="flex items-center gap-2 rounded bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
          :disabled="pingingAll || repoStore.repositories.length === 0"
          @click="pingAll"
        >
          <Icon name="lucide:refresh-cw" class="h-4 w-4" :class="{ 'animate-spin': pingingAll }" />
          {{ pingingAll ? 'Pinging...' : 'Ping All' }}
        </button>
        <button
          class="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          @click="openCreateDrawer"
        >
          <Icon name="lucide:plus" class="h-4 w-4" />
          Add Repository
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <Icon
        name="lucide:search"
        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search repositories..."
        class="w-full rounded border border-border bg-input py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-circle" class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <!-- Init error -->
    <div
      v-else-if="initError"
      class="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 py-10 text-center"
    >
      <Icon name="lucide:triangle-alert" class="h-10 w-10 text-destructive" />
      <p class="mt-3 font-medium text-destructive">Failed to load repositories</p>
      <p class="mt-1 max-w-sm text-xs text-muted-foreground">{{ initError }}</p>
      <button
        class="mt-4 flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        @click="loading = true; initError = ''; repoStore.init().then(() => loading = false).catch(e => { initError = String(e); loading = false })"
      >
        <Icon name="lucide:refresh-cw" class="h-4 w-4" />
        Retry
      </button>
    </div>

    <!-- Repository List -->
    <div v-else class="space-y-3">
      <div
        v-for="repo in filteredRepositories"
        :key="repo.id"
        class="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
        :class="{ 'opacity-60': !repo.enabled }"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Icon name="lucide:database" class="h-5 w-5 text-primary" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-semibold text-foreground truncate">{{ repo.name }}</h3>
                  <span
                    v-if="repo.enabled"
                    class="flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                    :class="statusBadgeClass(repo.id)"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusColor(repo.id)" />
                    {{ statusText(repo.id) }}
                  </span>
                  <span
                    v-if="!repo.enabled"
                    class="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    Disabled
                  </span>
                </div>
                <p class="text-sm text-muted-foreground truncate">{{ repo.url }}</p>
              </div>
            </div>
            <p v-if="repo.description" class="mt-2 text-sm text-muted-foreground line-clamp-2">
              {{ repo.description }}
            </p>
            <div v-if="repoStore.status[repo.id]" class="mt-2 text-xs text-muted-foreground">
              <span class="flex items-center gap-1">
                <Icon name="lucide:clock" class="h-3.5 w-3.5" />
                Last checked: {{ new Date(repoStore.status[repo.id]!.checkedAt).toLocaleTimeString() }}
                <span v-if="repoStore.status[repo.id]!.error" class="text-destructive ml-1">
                  — {{ repoStore.status[repo.id]!.error }}
                </span>
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex shrink-0 items-center gap-1">
            <button
              class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
              title="Ping repository"
              :disabled="!repo.enabled"
              @click="pingRepository(repo.id)"
            >
              <Icon
                name="lucide:refresh-cw"
                class="h-4 w-4"
                :class="{ 'animate-spin': pinging[repo.id] }"
              />
            </button>
            <button
              class="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-secondary"
              :title="repo.enabled ? 'Disable repository' : 'Enable repository'"
              :class="repo.enabled ? 'text-primary' : 'text-muted-foreground'"
              @click="toggleRepository(repo.id)"
            >
              <Icon
                :name="repo.enabled ? 'lucide:toggle-right' : 'lucide:toggle-left'"
                class="h-5 w-5"
              />
            </button>
            <button
              class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title="Edit repository"
              @click="openEditDrawer(repo)"
            >
              <Icon name="lucide:pencil" class="h-4 w-4" />
            </button>
            <button
              class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Delete repository"
              @click="deleteRepository(repo.id)"
            >
              <Icon name="lucide:trash-2" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredRepositories.length === 0"
        class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12"
      >
        <Icon name="lucide:database" class="h-12 w-12 text-muted-foreground/40" />
        <h3 class="mt-4 text-lg font-medium text-foreground">No repositories found</h3>
        <p class="mt-1 text-sm text-muted-foreground">
          {{ searchQuery ? 'Try a different search term' : 'Add a repository to get started' }}
        </p>
        <button
          v-if="!searchQuery"
          class="mt-4 flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          @click="openCreateDrawer"
        >
          <Icon name="lucide:plus" class="h-4 w-4" />
          Add Repository
        </button>
      </div>
    </div>

    <!-- Drawer Overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-[350ms] ease-in-out"
        leave-active-class="transition-opacity duration-[350ms] ease-in-out"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="drawerOpen"
          class="fixed inset-0 z-40 bg-black/50 will-change-[opacity]"
          @click="closeDrawer"
        />
      </Transition>
    </Teleport>

    <!-- Drawer -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-transform duration-[400ms] ease-drawer-open"
        leave-active-class="transition-transform duration-[350ms] ease-drawer-close"
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="drawerOpen"
          class="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md border-l border-border bg-card shadow-xl will-change-transform"
        >
          <div class="flex h-full flex-col">
            <!-- Drawer Header -->
            <div class="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 class="text-lg font-semibold text-foreground">
                {{ editingRepo ? 'Edit Repository' : 'Add Repository' }}
              </h2>
              <button
                class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                @click="closeDrawer"
              >
                <Icon name="lucide:x" class="h-5 w-5" />
              </button>
            </div>

            <!-- Drawer Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <form class="space-y-5" @submit.prevent="saveRepository">
                <!-- Name -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Repository Name</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    placeholder="My Repository"
                    required
                    class="w-full rounded border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <!-- URL -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Repository URL</label>
                  <input
                    v-model="formData.url"
                    type="url"
                    placeholder="https://repo.example.com"
                    required
                    class="w-full rounded border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p class="text-xs text-muted-foreground">Base URL of the modpack repository</p>
                </div>

                <!-- Description -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Description <span class="text-muted-foreground font-normal">(optional)</span></label>
                  <textarea
                    v-model="formData.description"
                    placeholder="A brief description of this repository..."
                    rows="3"
                    class="w-full resize-none rounded border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <!-- Enabled Toggle -->
                <div class="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p class="text-sm font-medium text-foreground">Enable Repository</p>
                    <p class="text-xs text-muted-foreground">Include when fetching modpacks</p>
                  </div>
                  <button
                    type="button"
                    class="relative h-6 w-11 rounded-full transition-colors"
                    :class="formData.enabled ? 'bg-primary' : 'bg-muted'"
                    @click="formData.enabled = !formData.enabled"
                  >
                    <span
                      class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                      :class="{ 'translate-x-5': formData.enabled }"
                    />
                  </button>
                </div>

                <!-- Error -->
                <p v-if="saveError" class="rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {{ saveError }}
                </p>
              </form>
            </div>

            <!-- Drawer Footer -->
            <div class="flex gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                class="flex-1 rounded border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                @click="closeDrawer"
              >
                Cancel
              </button>
              <button
                type="button"
                :disabled="saving"
                class="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                @click="saveRepository"
              >
                <Icon v-if="saving" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
                {{ saving ? 'Saving...' : editingRepo ? 'Save Changes' : 'Add Repository' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
