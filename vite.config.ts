import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve("src", "main.tsx"),
			name: "squash-search",
			fileName: (format) => `squash-search.${format}.js`,
		},
		cssCodeSplit: false,
	},
	plugins: [cssInjectedByJsPlugin(), react()],
	define: {
		"process.env": {},
	},
});
