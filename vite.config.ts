import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { execSync } from 'node:child_process'

const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
const buildVersion = `${Math.random()}+${commitHash}`

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  define: { __BUILD_VERSION__: JSON.stringify(buildVersion) }
});
