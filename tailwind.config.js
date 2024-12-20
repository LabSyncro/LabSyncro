const animate = require('tailwindcss-animate');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  safelist: [
    'dark',
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5',
    'w-[180px]',
  ],
  prefix: '',

  theme: {
    fontSize: {
      'ss': '10px',
      'sm': '12px',
      'normal': '14px',
      'md': '16px',
      'lg': '18px',
      'xl': '20px',
      '2xl': '24px',
      '4xl': '32px',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'primary-darker': '#010127',
        'primary-dark': '#010127BF',
        'primary-light': '#01012780',
        'primary-lighter': '#01012740',
        'secondary-darker': '#DAEDFF',
        'secondary-dark': '#DAEDFFBF',
        'secondary-light': '#DAEDFF80',
        'secondary-lighter': '#DAEDFF40',
        'tertiary-darker': '#005BFF',
        'tertiary-dark': '#005BFFBF',
        'tertiary-light': '#005BFF80',
        'tertiary-lighter': '#005BFF40',
        'gray-darker': '#0E0E2C',
        'gray-dark': '#0E0E2CBF',
        'gray-light': '#0E0E2C80',
        'gray-lighter': '#0E0E2C40',
        'danger-darker': '#ED4B9E',
        'danger-dark': '#ED4B9EBF',
        'danger-light': '#ED4B9E80',
        'danger-lighter': '#ED4B9E40',
        'safe-darker': '#00DC82',
        'safe-dark': '#00DC82BF',
        'safe-light': '#00DC8280',
        'safe-lighter': '#00DC8240',
        'slate-darker': '#0F172A',
        'slate-dark': '#64748B',
        'slate-light': '#F1F5F9',
        'slate-lighter': '#F8FaFC',
        'white': '#FFFFFF',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#01012780',
          foreground: '#010127',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
      },
    },
  },
  plugins: [animate],
};
