import type { Config } from "tailwindcss";

const config: Config = {
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#eaeaea',
                foreground: '#ffffff',
                hover_color: '#f7f7f7',
                primary: '#ff5733',
                light_text: '#c5ced3',
            }
        },
    },
    plugins: [],
};
export default config;