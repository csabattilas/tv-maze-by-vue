import { test, expect } from '@playwright/test'

test.describe('Drama genre Lists', () => {
  test('should display Drama genre list', async ({ page }) => {
    // navigate
    await page.goto('/')

    await page.getByText('Loading shows please wait...').waitFor({ state: 'detached' })

    const dramaHeader = page.locator('h2:has-text("Drama")').first()
    await expect(dramaHeader).toBeVisible()

    const genreList = dramaHeader.locator('+ div')
    await expect(genreList).toBeVisible()

    const showCards = genreList.locator('a[href*="/show/"]')
    await expect(showCards.first()).toBeVisible()

    const cardCount = await showCards.count()
    expect(cardCount).toBeGreaterThan(0)
  })
})
