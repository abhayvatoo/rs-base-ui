# rs-base-ui

Shared React UI components (Radix primitives + Tailwind v4, shadcn "new-york" style) with one baked-in theme. No per-app theming or customization surface — install it, pin a version, use what's provided.

## Install

```sh
npm install rs-base-ui
```

`react` and `react-dom` (`>=18 <20`) are peer dependencies — install them yourself if not already present.

## Usage

```jsx
import { Button, Input, Dialog, DialogContent, DialogTrigger } from 'rs-base-ui';
import 'rs-base-ui/styles.css'; // import once, e.g. in your app's entry point
```

The stylesheet is fully self-contained (Tailwind is compiled at build time inside this package), so **consuming apps do not need Tailwind installed** just to render these components. It only sets CSS custom properties and classes scoped to these components — it does not apply any global `*`/`body` reset, so it's safe to drop into an app that already has its own global styles.

## Components

Button, Input, Textarea, Label, Checkbox, RadioGroup/RadioGroupItem, Select (+ subcomponents), Dialog (+ subcomponents), AlertDialog (+ subcomponents), DropdownMenu (+ subcomponents), Table (+ subcomponents), Badge, Alert (+ AlertTitle/AlertDescription), Breadcrumb (+ subcomponents), Pagination (+ subcomponents), Tooltip (+ subcomponents), Progress.

Not included by design: file upload / date-picker / multi-select wrappers. Those wrap specific third-party libraries (`react-dropzone`, `react-datepicker`) that are app-specific integration choices, not look-and-feel — build them in the consuming app using `Input`/`Button`/`Popover` primitives from here.

## Releasing

```sh
npm version patch   # or minor / major
git push --follow-tags
```

Pushing a version tag triggers `.github/workflows/publish.yml`, which builds and runs `npm publish --access public` using the `NPM_TOKEN` repo secret.

## Local development against a consumer app

```sh
npm run build
npm link
# in the consumer app:
npm link rs-base-ui
```
