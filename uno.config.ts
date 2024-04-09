// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss';

export default defineConfig({
  presets: [presetAttributify({}), presetUno()],
  rules: [['will-change-transform', { 'will-change': 'transform' }]],
  shortcuts: [
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
    ['table-border', 'border-0 border-#e5e7eb border-solid'],
    ['table-outline', 'outline outline-1 outline-#2680EB']
  ]
});
