import {defineConfig} from 'vite';
import react from "@vitejs/plugin-react";
import path from "path";
// @ts-ignore
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config
export default defineConfig({
    plugins: [
        tailwindcss(),
        react({
            babel: {
                plugins: [
                     ["babel-plugin-react-compiler", {}]
                ]
            }
        })
    ],
    resolve: {
        alias: {
            "$": path.resolve(__dirname, "src")
        }
    }
});
