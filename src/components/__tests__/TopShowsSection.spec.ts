import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TopShowsSection from '../TopShowsSection.vue'

vi.mock('../ShowCard.vue', () => ({
  default: {
    props: ['show', 'rank', 'class'],
    template: '<div data-testid="show-card" :data-rank="rank" :data-show-id="show.id"></div>',
  },
}))

describe('TopShowsSection', () => {
  const mockShows = [
    {
      id: 1,
      name: 'Show 1',
      genres: ['Drama'],
      rating: { average: 8.5 },
      image: { medium: 'image1.jpg', original: 'image1-original.jpg' },
      summary: 'Summary 1',
      status: 'Running',
    },
    {
      id: 2,
      name: 'Show 2',
      genres: ['Comedy'],
      rating: { average: 9.0 },
      image: { medium: 'image2.jpg', original: 'image2-original.jpg' },
      summary: 'Summary 2',
      status: 'Running',
    },
    {
      id: 3,
      name: 'Show 3',
      genres: ['Action'],
      rating: { average: 7.5 },
      image: { medium: 'image3.jpg', original: 'image3-original.jpg' },
      summary: 'Summary 3',
      status: 'Ended',
    },
  ]

  it('renders the section title correctly', () => {
    const wrapper = mount(TopShowsSection, {
      props: {
        shows: mockShows,
      },
    })

    const title = wrapper.find('h2')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Top 10 Shows')
  })

  it('renders the correct number of ShowCard components', () => {
    const wrapper = mount(TopShowsSection, {
      props: {
        shows: mockShows,
      },
    })

    const showCards = wrapper.findAll('[data-testid="show-card"]')
    expect(showCards.length).toBe(mockShows.length)
  })

  it('passes the correct props to each ShowCard component', () => {
    const wrapper = mount(TopShowsSection, {
      props: {
        shows: mockShows,
      },
    })

    const showCards = wrapper.findAll('[data-testid="show-card"]')

    showCards.forEach((card, index) => {
      expect(card.attributes('data-rank')).toBe((index + 1).toString())
      expect(card.attributes('data-show-id')).toBe(mockShows[index].id.toString())
    })
  })

  it('renders correctly with an empty shows array', () => {
    const wrapper = mount(TopShowsSection, {
      props: {
        shows: [],
      },
    })

    const showCards = wrapper.findAll('[data-testid="show-card"]')
    expect(showCards.length).toBe(0)
    const section = wrapper.find('section')
    expect(section.exists()).toBe(true)
  })

  it('applies the correct CSS classes for layout and scrolling', () => {
    const wrapper = mount(TopShowsSection, {
      props: {
        shows: mockShows,
      },
    })

    const section = wrapper.find('section')
    expect(section.classes()).toContain('mb-10')

    const scrollContainer = wrapper.find('div')
    expect(scrollContainer.classes()).toContain('flex')
    expect(scrollContainer.classes()).toContain('overflow-x-auto')
    expect(scrollContainer.classes()).toContain('scrollbar-hide')
    expect(scrollContainer.classes()).toContain('snap-x')
  })
})
