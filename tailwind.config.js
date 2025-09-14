/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#eef2ff',
					100: '#e0e7ff',
					200: '#c7d2fe',
					300: '#a5b4fc',
					400: '#818cf8',
					500: '#6366f1', // main
					600: '#4f46e5',
					700: '#4338ca',
					800: '#3730a3',
					900: '#312e81'
				}
			},
			borderRadius: {
				card: '12px',
				btn: '8px'
			},
			boxShadow: {
				card: '0 2px 8px rgba(0,0,0,0.06)'
			}
		}
	},
	plugins: []
};
