/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
            colors: {
                'primary': {
                    lightest: '#fbe5e1', // Very light shade
                    lighter: '#f4b4a3', // Light shade
                    light: '#e87f5f',   // Soft shade
                    DEFAULT: '#d4542c',  // Main color
                    dark: '#bd4a27',    // Dark shade
                    darker: '#9c3e21',  // Darker shade
                    darkest: '#7a301a', // Very dark shade
                },
                'chart': {
                    'very-satisfied': '#10B981', // Green
                    'satisfied': '#34D399',      // Light Green
                    'neutral': '#FBBF24',        // Yellow
                    'unsatisfied': '#F97316',    // Orange
                    'very-unsatisfied': '#EF4444' // Red
                }
            },
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
} 