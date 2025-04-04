declare module 'vue-router' {
  import { RouteRecordRaw, Router, RouterOptions } from 'vue-router/dist/vue-router'
  export * from 'vue-router/dist/vue-router'
  export function createRouter(options: RouterOptions): Router
  export function createWebHistory(base?: string): RouterHistory
  export interface RouterHistory {
    readonly location: string
    readonly state: HistoryState
    push(to: string): void
    replace(to: string): void
    go(delta: number): void
    listen(callback: (to: string, from: string) => void): () => void
  }
  export interface HistoryState {
    [key: string]: any
  }
}
