import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                accent: 'var(--color-accent)',
                'accent-hover': 'var(--color-accent-hover)',
            },
            fontFamily: {
                display: ['Playfair Display', 'Georgia', 'serif'],
                body: ['DM Sans', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

export default config