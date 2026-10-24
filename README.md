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

Button, Input, Textarea, Label, Checkbox, RadioGroup/RadioGroupItem, Select (+ subcomponents), Dialog (+ subcomponents), AlertDialog (+ subcomponents), DropdownMenu (+ subcomponents), Table (+ subcomponents), Badge, Alert (+ AlertTitle/AlertDescription), Breadcrumb (+ subcomponents), Pagination (+ subcomponents), Tooltip (+ subcomponents), Progress, Tabs (+ subcomponents), Popover (+ subcomponents), Calendar.

`Calendar` is shadcn's calendar on [DayPicker](https://daypicker.dev) (`@daypicker/react`, installed as a dependency). Every DayPicker prop passes through:

```jsx
<Calendar
  mode="multiple"
  selected={days}
  onSelect={setDays}
  month={new Date(2026, 10, 1)}           // show one fixed month…
  hideNavigation                          // …with no prev/next buttons
  showOutsideDays={false}
  disabled={{ dayOfWeek: [1, 2, 3, 4, 5] }} // or { before }, { after }, dates, functions
  modifiers={{ booked: bookedDays }}      // extra day states, styled by modifiersClassNames
  readOnly={locked}                       // shows `selected` but ignores clicks and keys
/>
```

Cell size is the `--cell-size` CSS variable (default `--spacing(8)`), e.g. `className="[--cell-size:--spacing(10)]"`.

Not included by design: file upload / date-input / multi-select wrappers. Those wrap specific third-party libraries (`react-dropzone`, `react-datepicker`) that are app-specific integration choices, not look-and-feel — build them in the consuming app using `Input`/`Button`/`Popover`/`Calendar` primitives from here.

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
