import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      // Accessibility is a stated requirement, so lint for it rather than
      // relying on a manual pass at the end. The rules are spread rather than
      // extending `jsxA11y.flatConfigs.strict` wholesale, because
      // eslint-config-next already registers the jsx-a11y plugin and a second
      // registration is a hard config error.
      ...jsxA11y.flatConfigs.strict.rules,

      // The design system deliberately uses plain <picture>/<img> via the
      // CakeImage wrapper: next/image's optimizer needs a server, and this is
      // a static export. Images are pre-optimized at build time instead.
      "@next/next/no-img-element": "off",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
