import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ShowCard from '../ShowCard.vue'
import { PLACEHOLDER_IMAGE } from '@model/constants'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/show/:id',
      name: 'ShowDetails',
      component: { template: '<div>Show Details</div>' },
    },
  ],
})

vi.mock('@heroicons/vue/24/outline', () => ({
  InformationCircleIcon: {
    render: () => null,
  },
}))

vi.mock('../ResponsiveImage.vue', () => ({
  default: {
    props: ['mobileSrc', 'desktopSrc', 'fallbackSrc', 'alt'],
    template: '<div data-testid="responsive-image"></div>',
  },
}))

describe('ShowCard', () => {
  const mockShow = {
    id: 1,
    name: 'Test Show',
    genres: ['Drama', 'Comedy'],
    rating: {
      average: 8.5,
    },
    image: {
      medium: 'medium-image.jpg',
      original: 'original-image.jpg',
    },
    summary: 'Test summary',
    status: 'Running',
  }

  it('renders the show name correctly', async () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Test Show')
  })

  it('renders the genres correctly', async () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Drama, Comedy')
  })

  it('passes the correct props to ResponsiveImage', async () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
      global: {
        plugins: [router],
      },
    })

    const responsiveImage = wrapper.find('[data-testid="responsive-image"]')
    expect(responsiveImage.exists()).toBe(true)

    const responsiveImageProps = wrapper.findComponent({ name: 'ResponsiveImage' }).props()
    expect(responsiveImageProps.mobileSrc).toBe('medium-image.jpg')
    expect(responsiveImageProps.desktopSrc).toBe('original-image.jpg')
    expect(responsiveImageProps.fallbackSrc).toBe(PLACEHOLDER_IMAGE)
    expect(responsiveImageProps.alt).toBe('Test Show')
  })

  it('displays the rating when available', async () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
      global: {
        plugins: [router],
      },
    })

    const ratingElement = wrapper.find('.absolute.z-10.top-2.right-2')
    expect(ratingElement.exists()).toBe(true)
    expect(ratingElement.text()).toBe('8.5')
  })

  it('does not display rating when not available', async () => {
    const showWithoutRating = {
      ...mockShow,
      rating: { average: null },
    }

    const wrapper = mount(ShowCard, {
      props: {
        show: showWithoutRating,
      },
      global: {
        plugins: [router],
      },
    })

    const ratingElement = wrapper.find('.absolute.z-10.top-2.right-2')
    expect(ratingElement.exists()).toBe(false)
  })

  it('displays rank instead of rating when provided', async () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
        rank: 1,
      },
      global: {
        plugins: [router],
      },
    })

    const rankElement = wrapper.find('.rank')
    expect(rankElement.exists()).toBe(true)
    expect(rankElement.text()).toContain('1')

    const ratingElement = wrapper.find('.absolute.z-10.top-2.right-2')
    expect(ratingElement.exists()).toBe(false)
  })

  it('contains a router link to the show details page', async () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
      },
      global: {
        plugins: [router],
      },
    })

    const routerLink = wrapper.find('a')
    expect(routerLink.attributes('href')).toBe('/show/1')
    expect(routerLink.attributes('title')).toBe('View Details')
  })
})
