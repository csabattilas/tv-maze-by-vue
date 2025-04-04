import { ref, onMounted, onUnmounted } from 'vue'

interface InfiniteScrollOptions {
  // Optional delay before setting up observers (ms)
  initDelay?: number
  // Threshold for intersection observer (0-1)
  threshold?: number
  // Callback when end is reached and more items should be loaded
  onLoadMore?: () => void
}

/**
 * Composable for implementing virtual infinite scrolling with IntersectionObserver
 * Loads more items when scrolling to the right
 * 
 * @param options Configuration options for the infinite scroll
 * @returns An object containing refs and methods for infinite scrolling
 */
export function useInfiniteScroll(options: InfiniteScrollOptions = {}) {
  // Default options
  const { 
    initDelay = 100,
    threshold = 0.1,
    onLoadMore = () => {} // Default no-op function
  } = options

  // References for the scroll container and sentinel elements
  const scrollContainer = ref<HTMLElement | null>(null)
  const endSentinel = ref<HTMLElement | null>(null)
  
  // Track if we're currently loading more items
  const isLoading = ref(false)

  // Variables to store observer
  let endObserver: IntersectionObserver | null = null

  // Set up intersection observer for infinite scrolling
  const setupIntersectionObserver = () => {
    if (!scrollContainer.value || !endSentinel.value) return
    
    // Create observer for the end sentinel
    endObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        
        if (entry.isIntersecting && !isLoading.value) {
          // We've scrolled to the end, call the callback to load more
          isLoading.value = true
          onLoadMore()
          
          // Reset loading state after a short delay
          setTimeout(() => {
            isLoading.value = false
          }, 500)
        }
      },
      { threshold }
    )
    
    // Start observing the end sentinel
    endObserver.observe(endSentinel.value)
  }

  // Initialize when the component is mounted
  onMounted(() => {
    // Set up intersection observer after a short delay to ensure DOM is ready
    setTimeout(() => {
      setupIntersectionObserver()
    }, initDelay)
  })

  // Clean up observer when component is unmounted
  onUnmounted(() => {
    if (endObserver) endObserver.disconnect()
  })

  return {
    scrollContainer,
    endSentinel,
    isLoading
  }
}

/**
 * Simple scroll container reference for horizontal scrolling
 * 
 * @returns A reference to the scroll container
 */
export function useScroll() {
  // Reference for the scroll container
  const scrollContainer = ref<HTMLElement | null>(null)

  return {
    scrollContainer
  }
}
