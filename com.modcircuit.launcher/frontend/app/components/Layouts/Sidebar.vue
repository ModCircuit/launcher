<script setup lang="ts">
interface Props {
  collapsed: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: []
}>()

interface NavItem {
  id: string
  label: string
  icon: string
}

const route = useRoute()

const mainNavItems: NavItem[] = [
  { id: 'index', label: 'Home', icon: 'lucide:home' },
  { id: 'modpacks', label: 'Modpacks', icon: 'lucide:package' },
  { id: 'downloads', label: 'Downloads', icon: 'lucide:download' },
  { id: 'instances', label: 'Instances', icon: 'lucide:folder' },
  { id: 'repositories', label: 'Repositories', icon: 'lucide:folder-tree' },
]

const bottomNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: 'lucide:settings' },
  { id: 'about', label: 'About', icon: 'lucide:info' },
]

const getNavItemClass = (itemId: string) => {
  const baseClass = 'flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors'
  if (route.name === itemId) {
    return `${baseClass} bg-primary/10 text-primary`
  }
  return `${baseClass} text-muted-foreground hover:bg-secondary hover:text-foreground`
}

const navigateToRoute = (itemId: string) => {
  navigateTo({ name: itemId })
}
</script>

<template>
  <aside
    class="flex flex-col border-r border-border bg-card transition-all duration-300"
    :class="collapsed ? 'w-16' : 'w-56'"
  >
    <!-- Toggle Button -->
    <div class="flex items-center justify-end p-2">
      <button
        class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Toggle sidebar"
        @click="emit('toggle')"
      >
        <Icon
          :name="collapsed ? 'lucide:chevron-right' : 'lucide:chevron-left'"
          class="h-4 w-4"
        />
      </button>
    </div>

    <!-- Main Navigation -->
    <nav class="flex-1 space-y-1 px-2">
      <button
        v-for="item in mainNavItems"
        :key="item.id"
        :class="getNavItemClass(item.id)"
        class="w-full"
        :title="collapsed ? item.label : undefined"
        @click="navigateToRoute(item.id)"
      >
        <Icon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Bottom Navigation -->
    <nav class="space-y-1 border-t border-border px-2 py-3">
      <button
        v-for="item in bottomNavItems"
        :key="item.id"
        :class="getNavItemClass(item.id)"
        class="w-full"
        :title="collapsed ? item.label : undefined"
        @click="navigateToRoute(item.id)"
      >
        <Icon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
      </button>
    </nav>
  </aside>
</template>
