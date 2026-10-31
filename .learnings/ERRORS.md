# Errors

Command failures and integration errors.

---

## [ERR-20260530-002] browser_wait_for_load_state_networkidle

**Logged**: 2026-05-30T18:45:51+08:00
**Priority**: low
**Status**: pending
**Area**: tests

### Summary
The in-app browser runtime rejected `waitForLoadState({ state: 'networkidle' })` while checking a local H5 app.

### Error
`playwright_wait_for_load_state does not support networkidle`

### Context
- Operation attempted: open `http://localhost:5178/` and wait for network idle before visual verification.

### Suggested Fix
Use `waitForLoadState({ state: 'load' })` or `domcontentloaded` with this browser runtime.

### Metadata
- Reproducible: unknown
- Related Files: none

---

## [ERR-20260530-001] css_font_scaling_regex_precedence

**Logged**: 2026-05-30T18:45:51+08:00
**Priority**: low
**Status**: pending
**Area**: frontend

### Summary
A bulk CSS scaling regex matched `line-height` but skipped `font-size` because alternation precedence was wrong.

### Error
`(font-size|line-height:\s*)...` only attached `:\s*` to the `line-height` branch.

### Context
- Operation attempted: scale `font-size` and `line-height` declarations by 10% in source styles.
- Detected during spot-check before build.

### Suggested Fix
Group the alternation separately, for example `((?:font-size|line-height):\s*)...`, or run focused regexes per CSS property.

### Metadata
- Reproducible: yes
- Related Files: App.vue, pages/*.vue, components/*.vue

---

## [ERR-20260516-001] npm_install_uniapp_dependency_conflict

**Logged**: 2026-05-16T20:51:30+08:00
**Priority**: medium
**Status**: pending
**Area**: config

### Summary
Installing uniapp H5 dependencies failed when using `latest` DCloud packages and then Vite 5.

### Error
`@dcloudio/uni-app@latest` resolved to a Vue2-oriented 2.x package with `@vue/composition-api`; Vue3 projects should use the `vue3` dist-tag. The 2026 Vue3 plugin version also peers `vite@8.0.13`, not Vite 5.

### Context
- Command attempted: `npm install`
- Project: uniapp Vue3 H5 runtime setup

### Suggested Fix
Pin DCloud packages to the same `vue3` dist-tag version and set `vite` to the plugin peer version.

### Metadata
- Reproducible: yes
- Related Files: package.json

---

## [ERR-20260524-002] npm_build_app_vue_parse_error

**Logged**: 2026-05-24T17:30:00+08:00
**Priority**: medium
**Status**: pending
**Area**: config

### Summary
H5 build failed while parsing root `App.vue` as raw JSX/HTML instead of a Vue SFC.

### Error
`[PARSE_ERROR] Unexpected JSX expression` at `App.vue:1:1` during `npm run build:h5`.

### Context
- Command attempted: `npm run build:h5`
- Project: uni-app Vue3 app in HBuilderX-compatible root layout

### Suggested Fix
If H5 packaging is required, move to a build layout that the current CLI resolves as a Vue SFC root, or align the local CLI/plugin versions with the HBuilderX compiler path.

### Metadata
- Reproducible: yes
- Related Files: App.vue, main.js, package.json

---
