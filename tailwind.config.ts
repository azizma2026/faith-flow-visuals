
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				islamic: {
					green: '#1D645D',
					'light-green': '#4AA183',
					blue: '#0D3B66',
					'light-blue': '#3C91E6',
					gold: '#D9A21B',
					beige: '#F3E9DC',
					sand: '#E2D1C3',
					'dark-navy': '#1A1F2C',
					'light-beige': '#F8F4EA',
					'medium-beige': '#E8DFD0',
					'warm-beige': '#D5C7A9',
					'text-brown': '#564F47',
					'text-light-brown': '#8A7356'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'prayer-pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'prayer-pulse': 'prayer-pulse 2s ease-in-out infinite'
			},
			backgroundImage: {
				'islamic-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23d5c7a9' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/svg%3E\")",
				'mosque-silhouette': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='80' viewBox='0 0 200 80'%3E%3Cpath d='M10,80 L10,60 L20,60 L20,80 L30,80 L30,50 L40,40 L50,50 L50,80 L60,80 L60,70 L65,70 L65,80 L75,80 L75,70 L80,60 L85,70 L85,80 L95,80 L95,60 L100,50 L105,60 L105,80 L115,80 L115,70 L120,70 L120,80 L130,80 L130,60 L140,60 L140,80 L150,80 L150,50 L160,40 L170,50 L170,80 L180,80 L180,60 L190,60 L190,80 Z' fill='%23d5c7a9' fill-opacity='0.4'/%3E%3C/svg%3E\")",
				'islamic-arch': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='80' viewBox='0 0 100 80'%3E%3Cpath d='M0,80 L0,40 C0,20 20,0 50,0 C80,0 100,20 100,40 L100,80 L80,80 L80,40 C80,30 70,20 50,20 C30,20 20,30 20,40 L20,80 Z' fill='%23d5c7a9' fill-opacity='0.3'/%3E%3C/svg%3E\")",
				'islamic-geometric': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50,0 L100,50 L50,100 L0,50 Z M50,20 L80,50 L50,80 L20,50 Z' fill='none' stroke='%23d5c7a9' stroke-width='1' stroke-opacity='0.5'/%3E%3C/svg%3E\")"
			},
			fontFamily: {
				arabic: ['Scheherazade New', 'serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
