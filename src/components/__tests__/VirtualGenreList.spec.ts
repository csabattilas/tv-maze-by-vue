import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import VirtualGenreList from '../VirtualGenreList.vue'
import type { TvShow } from '@model/tvMaze'

// mock the useVirtualList composable with virtualization behavior
vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core')
  return {
    ...(actual as Record<string, unknown>),
    useVirtualList: vi.fn((list, options = {}) => {
      const { itemWidth = 188, overscan = 5 } = options as { itemWidth?: number; overscan?: number }

      const visibleCount = 5
      const totalVisibleCount = visibleCount + overscan * 2 // Add overscan items

      const getVisibleItems = () => {
        const allItems = list.value.map((item: TvShow, index: number) => ({ data: item, index }))
        return allItems.slice(0, Math.min(totalVisibleCount, allItems.length))
      }

      return {
        list: getVisibleItems(),
        containerProps: {
          'data-testid': 'virtual-container',
          style: { width: `${visibleCount * itemWidth}px`, overflow: 'auto' },
        },
        wrapperProps: {
          'data-testid': 'virtual-wrapper',
          style: { width: `${list.value.length * itemWidth}px` },
        },
        scrollTo: vi.fn(),
        getVisibleRange: vi.fn(() => ({ start: 0, end: totalVisibleCount - 1 })),
      }
    }),
  }
})

// mock the useMediaQuery composable with a ref value for matches
const matchesRef = ref(false)
vi.mock('@composables/useMediaQuery', () => ({
  useMediaQuery: vi.fn(() => ({ matches: matchesRef })),
}))

// mock the ShowCard component
vi.mock('../ShowCard.vue', () => ({
  default: {
    props: ['show', 'isMobile'],
    template: '<div data-testid="show-card">{{ show.name }}</div>',
  },
}))

describe('VirtualGenreList', () => {
  const mockShows: TvShow[] = [
    {
      id: 1,
      name: 'Test Show 1',
      genres: ['Drama', 'Comedy'],
      rating: { average: 8.5 },
      image: {
        medium: 'medium-image-1.jpg',
        original: 'original-image-1.jpg',
      },
      summary: 'Test summary 1',
      status: 'Running',
    },
    {
      id: 2,
      name: 'Test Show 2',
      genres: ['Action', 'Thriller'],
      rating: { average: 9.0 },
      image: {
        medium: 'medium-image-2.jpg',
        original: 'original-image-2.jpg',
      },
      summary: 'Test summary 2',
      status: 'Ended',
    },
  ]

  it('renders the genre title correctly', () => {
    const wrapper = mount(VirtualGenreList, {
      props: {
        title: 'Test Genre',
        shows: mockShows,
      },
    })

    expect(wrapper.find('h2').text()).toBe('Test Genre')
  })

  it('renders the virtual container and wrapper', () => {
    const wrapper = mount(VirtualGenreList, {
      props: {
        title: 'Test Genre',
        shows: mockShows,
      },
    })

    expect(wrapper.find('[data-testid="virtual-container"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="virtual-wrapper"]').exists()).toBe(true)
  })

  it('renders the correct number of show cards', () => {
    const wrapper = mount(VirtualGenreList, {
      props: {
        title: 'Test Genre',
        shows: mockShows,
      },
    })

    const showCards = wrapper.findAll('[data-testid="show-card"]')
    expect(showCards.length).toBe(mockShows.length)
  })

  it('passes the correct props to ShowCard components', () => {
    const wrapper = mount(VirtualGenreList, {
      props: {
        title: 'Test Genre',
        shows: mockShows,
      },
    })

    const showCardComponents = wrapper.findAllComponents({ name: 'ShowCard' })
    expect(showCardComponents.length).toBe(mockShows.length)

    const firstShowCard = showCardComponents[0]
    expect(firstShowCard.props('show')).toEqual(mockShows[0])
  })

  it('handles empty shows array gracefully', () => {
    const wrapper = mount(VirtualGenreList, {
      props: {
        title: 'Empty Genre',
        shows: [],
      },
    })

    expect(wrapper.find('h2').text()).toBe('Empty Genre')
    expect(wrapper.findAll('[data-testid="show-card"]').length).toBe(0)
  })

  it('handles a large number of shows that exceed visible area', () => {
    const largeShowsList: TvShow[] = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Show ${i + 1}`,
      genres: ['Drama', 'Comedy'],
      rating: { average: 8.0 },
      image: {
        medium: `medium-image-${i + 1}.jpg`,
        original: `original-image-${i + 1}.jpg`,
      },
      summary: `Summary for show ${i + 1}`,
      status: 'Running',
    }))

    const wrapper = mount(VirtualGenreList, {
      props: {
        title: 'Large Genre',
        shows: largeShowsList,
      },
    })

    // check the container
    expect(wrapper.find('[data-testid="virtual-container"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="virtual-wrapper"]').exists()).toBe(true)

    // check the rendered items as we are mocking the virtual list
    const showCards = wrapper.findAll('[data-testid="show-card"]')
    const expectedVisibleItems = 15 // 5 visible + 10 overscan

    // should not render 50 items
    expect(showCards.length).toBe(expectedVisibleItems)

    // verify the first visible item is correct
    expect(showCards[0].text()).toBe('Show 1')

    // verify the last visible item is what we expect based on our mock
    const lastVisibleIndex = expectedVisibleItems - 1
    expect(showCards[lastVisibleIndex].text()).toBe(`Show ${lastVisibleIndex + 1}`)
  })
})
