import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import filenamesSimple from "eslint-plugin-filenames-simple";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...[
    js.configs.recommended,
    {
      plugins: {
        "@typescript-eslint": tsPlugin,
        "no-relative-import-paths": noRelativeImportPaths,
        "filenames-simple": filenamesSimple
      },
      rules: {
        "no-relative-import-paths/no-relative-import-paths": "error",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-explicit-any": [
          "warn",
          {
            ignoreRestArgs: true
          }
        ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            ignoreRestSiblings: true
          }
        ],
        "filenames-simple/naming-convention": [
          "error",
          {
            rule: "kebab-case",
            excepts: ["index"]
          }
        ]
      }
    }
  ]
];

export default eslintConfig;
