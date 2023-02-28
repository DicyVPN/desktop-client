/** @type {import('tailwindcss').Config} */
const tailwindcss = {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
            mono: ['"JetBrains Mono"', 'monospace']
        },
        fontSize: {
            'h1': ['2.25rem', {lineHeight: '2.5rem'}], // 36px
            'h2': ['1.5rem', {lineHeight: '2rem'}], // 24px
            'subtitle': ['1.25rem', {lineHeight: '1.75rem'}], // 20px
            'medium': ['1.125rem', {lineHeight: '1.75rem'}], // 18px
            'normal': ['1rem', {lineHeight: '1.5rem'}], // 16px
            'small': ['0.875rem', {lineHeight: '1.25rem'}], // 14px
        },
        colors: {
            'inherit': 'inherit',
            'current': 'currentColor',
            'transparent': 'transparent',
            'white': '#ffffff',
            'blue': {
                100: 'hsl(222, 95%, 88%)',
                200: 'hsl(222, 95%, 82%)',
                300: 'hsl(222, 91%, 71%)',
                400: 'hsl(222, 86%, 65%)',
                500: 'hsl(222, 73%, 54%)',
                600: 'hsl(222, 72%, 39%)',
                700: 'hsl(222, 77%, 27%)'
            },
            'gray': {
                100: 'hsl(222, 48%, 90%)',
                200: 'hsl(222, 34%, 75%)',
                300: 'hsl(222, 19%, 54%)',
                400: 'hsl(222, 20%, 40%)',
                500: 'hsl(222, 20%, 28%)',
                600: 'hsl(222, 22%, 19%)',
                700: 'hsl(222, 18%, 14%)',
                800: 'hsl(222, 18%, 11%)',
                900: 'hsl(222, 10%, 5%)'
            },
            'red': {
                100: 'hsl(344, 90%, 96%)',
                300: 'hsl(344, 75%, 48%)',
                500: 'hsl(344, 73%, 38%)',
                600: 'hsl(344, 77%, 27%)',
                900: 'hsl(344, 86%, 11%)'
            },
            'green': {
                100: 'hsl(102, 90%, 92%)',
                500: 'hsl(102, 76%, 30%)',
                600: 'hsl(102, 76%, 21%)',
                900: 'hsl(102, 88%, 10%)'
            },
            'bright-green': 'hsl(102, 100%, 54%)',
            'sky-blue': 'hsl(192, 95%, 65%)'
        },
        spacing: {
            4: '0.25rem', // 4px
            8: '0.5rem', // 8px
            12: '0.75rem', // 12px
            16: '1rem', // 16px
            20: '1.25rem', // and so on
            24: '1.5rem',
            28: '1.75rem',
            32: '2rem',
            36: '2.25rem',
            48: '3rem',
            64: '4rem',
            80: '5rem',
            96: '6rem',
            128: '8rem',
            192: '12rem',
            256: '16rem',
            384: '24rem'
        }
    }
};

module.exports = {
    plugins: {
        tailwindcss,
        autoprefixer: {},
    },
}