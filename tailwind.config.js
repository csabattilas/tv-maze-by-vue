/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#9ca3af', // light grey
          400: '#6b7280', // medium-light grey
          500: '#4b5563', // medium grey
          600: '#374151', // medium-dark grey
          700: '#212529', // dark grey
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        success: {
          500: '#22c55e',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.primary.700'),
            '--tw-prose-headings': theme('colors.primary.700'),
            '--tw-prose-lead': theme('colors.primary.600'),
            '--tw-prose-links': theme('colors.primary.500'),
            '--tw-prose-bold': theme('colors.primary.700'),
            '--tw-prose-counters': theme('colors.primary.600'),
            '--tw-prose-bullets': theme('colors.primary.700'),
            '--tw-prose-hr': theme('colors.primary.300'),
            '--tw-prose-quotes': theme('colors.primary.600'),
            '--tw-prose-quote-borders': theme('colors.primary.300'),
            '--tw-prose-captions': theme('colors.primary.700'),
            '--tw-prose-code': theme('colors.primary.700'),
            '--tw-prose-pre-code': theme('colors.primary.100'),
            '--tw-prose-pre-bg': theme('colors.primary.800'),
            '--tw-prose-th-borders': theme('colors.primary.300'),
            '--tw-prose-td-borders': theme('colors.primary.200'),
            a: {
              color: 'var(--tw-prose-links)',
              '&:hover': {
                color: 'color-mix(in srgb, var(--tw-prose-links) 70%, white)', // ← override hover color
              },
            },
          },
        },
        dark: {
          css: {
            '--tw-prose-body': theme('colors.primary.300'),
            '--tw-prose-headings': theme('colors.primary.700'),
            '--tw-prose-lead': theme('colors.primary.400'),
            '--tw-prose-links': theme('colors.primary.300'),
            '--tw-prose-bold': theme('colors.primary.700'),
            '--tw-prose-counters': theme('colors.primary.400'),
            '--tw-prose-bullets': theme('colors.primary.600'),
            '--tw-prose-hr': theme('colors.primary.700'),
            '--tw-prose-quotes': theme('colors.primary.300'),
            '--tw-prose-quote-borders': theme('colors.primary.700'),
            '--tw-prose-captions': theme('colors.primary.400'),
            '--tw-prose-code': theme('colors.primary.700'),
            '--tw-prose-pre-code': theme('colors.primary.300'),
            '--tw-prose-pre-bg': theme('colors.primary.900'),
            '--tw-prose-th-borders': theme('colors.primary.600'),
            '--tw-prose-td-borders': theme('colors.primary.700'),
          },
        },
      }),
    },
    darkMode: 'media',
  },
}
