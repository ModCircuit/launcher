<script setup lang="ts">
import { ref } from 'vue'
import { Minimize, Maximize, Close } from "../wailsjs/go/main/App";

const isMaximized = ref(false)

const handleMinimize = () => {
  Minimize()
}

const handleMaximize = () => {
  isMaximized.value = !isMaximized.value
  Maximize()
}

const handleClose = () => {
  Close()
}
</script>

<template>
  <header
    class="flex h-10 items-center justify-between border-b border-border bg-card px-4"
    style="-webkit-app-region: drag; --wails-draggable: drag;"
  >
    <!-- Logo and Title -->
    <div class="flex items-center gap-3">
      <img
        src="~/assets/images/modcircuit-logo.png"
        alt="ModCircuit"
        class="h-6 w-6"
      />
      <span class="font-display text-lg font-semibold tracking-wide text-foreground">
        ModCircuit Launcher
      </span>
      <span class="rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
        v1.0.0
      </span>
    </div>

    <!-- Window Controls -->
    <div class="flex items-center gap-1" style="-webkit-app-region: no-drag">
      <button
        class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Minimize"
        @click="handleMinimize"
      >
        <Icon name="lucide:minus" class="h-4 w-4" />
      </button>
      <button
        class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Maximize"
        @click="handleMaximize"
      >
        <Icon v-if="isMaximized" name="lucide:minimize-2" class="h-4 w-4" />
        <Icon v-else name="lucide:maximize-2" class="h-4 w-4" />
      </button>
      <button
        class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Close"
        @click="handleClose"
      >
        <Icon name="lucide:x" class="h-4 w-4" />
      </button>
    </div>
  </header>
</template>
