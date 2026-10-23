import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // One date picker for the whole app (components/ui/date-picker.tsx).
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='type'][value.value=/^(date|datetime-local|month|week|time)$/]",
          message: "Usá DatePicker o DateRangePicker de @/components/ui/date-picker en lugar de un input nativo de fecha.",
        },
        {
          selector: "JSXOpeningElement[name.name='textarea']",
          message:
            "No uses <textarea> nativo: para editar, Textarea de @/components/ui/textarea; para mostrar texto, un <div> con whitespace-pre-wrap.",
        },
      ],
    },
  },
  {
    // The one place a native textarea lives: the shared component itself.
    files: ["src/components/ui/textarea.tsx"],
    rules: { "no-restricted-syntax": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored/minified assets (the maplibre worker copy).
    "public/**",
  ]),
]);

export default eslintConfig;
