<script setup lang="ts">
import {ref} from "vue";
import TitleBar from "~/components/Layouts/TitleBar.vue";
import Sidebar from "~/components/Layouts/Sidebar.vue";

const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-background">
    <!-- Title Bar -->
    <TitleBar />

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar
          :collapsed="sidebarCollapsed"
          @toggle="toggleSidebar"
      />

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
