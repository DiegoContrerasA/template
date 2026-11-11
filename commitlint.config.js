/**
 * Commit message must match:
 * ^((feat|fix|chore|docs|refactor|test|perf|build|ci|revert)(\([a-z0-9-]+\))?!?: .{1,72}|Revert ".*"|Merge .*)
 *
 * @commitlint/config-conventional already accepts this exact type/scope/"!"
 * shape and ignores "Merge ..." and 'Revert "..."' commits by default
 * (defaultIgnores). The rules below just narrow the type list to the ones
 * in the regex and cap the subject length to match `.{1,72}`.
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "refactor",
        "test",
        "perf",
        "build",
        "ci",
        "revert",
      ],
    ],
    "subject-max-length": [2, "always", 72],
    "subject-case": [0],
  },
};
