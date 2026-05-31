# React Learning Hub by Malaka

A structured, code-first learning platform for modern React development. Built to help frontend teams understand React hooks, state management patterns, and architectural patterns through working, interactive examples.

Each concept is broken into three difficulty levels — **Easy**, **Medium**, and **Advanced** — so learners can progress at their own pace without switching platforms.

---

## What is covered

### Core Hooks

| Hook              | Easy                            | Medium                                          | Advanced                                          |
| ----------------- | ------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| `useState`        | Boolean and counter state       | Form state with validation and derived values   | Lazy initialization, array state, wizard patterns |
| `useEffect`       | Data fetching on mount          | Debounced search with cleanup                   | Polling with setInterval and cleanup              |
| `useLayoutEffect` | Flicker-free DOM measurement    | Tooltip positioning before paint                | Synchronized scroll and scroll restoration        |
| `useRef`          | DOM focus and scroll            | Mutable value store, previous value tracking    | `forwardRef` and `useImperativeHandle`            |
| `useMemo`         | Expensive factorial calculation | Filtering and sorting a large list              | Stable object references for `React.memo`         |
| `useCallback`     | Preventing child re-renders     | Task list with stable callbacks                 | Custom hook returning a memoized search function  |
| `useReducer`      | Counter with typed actions      | Form state machine (idle/loading/success/error) | Multi-step checkout wizard                        |

### Modern Hooks (React 18 and 19)

| Hook               | Easy                          | Medium                                      | Advanced                                           |
| ------------------ | ----------------------------- | ------------------------------------------- | -------------------------------------------------- |
| `useTransition`    | Tab switcher with slow render | Search with live input and deferred results | Multi-filter visualization with concurrent updates |
| `useDeferredValue` | Deferred list rendering       | Real API filtering with deferred query      | Combined with `useMemo` for maximum efficiency     |
| `useId`            | Accessible form fields        | Dynamic list of form instances              | Complex ARIA patterns with cross-element IDs       |
| `useOptimistic`    | Optimistic like button        | Full CRUD todo list with rollback           | Forced failure demo and explicit rollback handling |

### React 19

| API              | Easy                            | Medium                                  | Advanced                                         |
| ---------------- | ------------------------------- | --------------------------------------- | ------------------------------------------------ |
| `use()`          | Reading a Promise during render | Reading Context conditionally           | Promise caching to prevent duplicate fetches     |
| `useActionState` | Simple counter action           | Form submission with server validation  | Multi-step async form with history               |
| `useFormStatus`  | Submit button and status banner | Reusable `FormField` that self-disables | Full React 19 form pattern with `useActionState` |

### Context API

- **Easy:** Theme context with `createContext`, `Provider`, and a custom `useTheme` hook
- **Medium:** Auth context with login/logout, session management, and protected UI
- **Advanced:** Context combined with `useReducer` — the Redux pattern without the library

### Redux Toolkit

- **Easy:** Counter with `createSlice`, `useAppSelector`, and `useAppDispatch`
- **Medium:** Async data fetching with `createAsyncThunk` and loading/error state
- **Advanced:** Multiple slices (products + cart) composing state from DummyJSON

### Custom Hooks

- **Easy:** `useFetch` — generic data fetching with loading/error handling
- **Medium:** `useLocalStorage` and `useDebounce`
- **Advanced:** `useIntersectionObserver` composed with `usePagination` for infinite scroll

### React Patterns

| Pattern                 | Easy                              | Medium                                 | Advanced                                         |
| ----------------------- | --------------------------------- | -------------------------------------- | ------------------------------------------------ |
| Suspense + `React.lazy` | Lazy-loading a heavy component    | Multiple independent lazy sections     | Nested Suspense with error boundary recovery     |
| Error Boundaries        | Basic class component boundary    | Retry capability with attempt limits   | Critical vs silent boundary strategies           |
| Portals                 | Modal escaping `overflow: hidden` | Toast notification system              | Smart tooltip with `useLayoutEffect` positioning |
| Higher Order Components | `withLoading` HOC                 | `withAuth` with role-based access      | HOC composition with `compose()` utility         |
| Render Props            | Hover and toggle via render prop  | Generic `DataFetcher` with render prop | `MouseTracker` with composed providers           |
| Compound Components     | Tabs with dot notation API        | Accordion with exclusive/multi mode    | `FlexCard` with Context-driven variant theming   |

### Decision Guide

A dedicated page that answers "which tool do I use here?" organized around 19 real developer situations — not API names. Covers decisions like Context vs Redux, `useRef` vs `useState`, event handler vs `useEffect`, and more. Each entry links directly to the relevant example pages.

---

## How the platform works

Every page follows the same layout:

1. **PageIntro** — title, difficulty badge, description, and a "What you will learn" list with a direct link to the source file on GitHub
2. **Working demo** — a live, interactive example using real data from public APIs
3. **LevelNavigator** — buttons to move to the previous or next difficulty level

The learning model is deliberate: interact with the demo to understand _what_ a concept does, then read the source code to understand _how_ it is built. Every page links directly to its own source file on GitHub so you can read the implementation without cloning the repo.

---

## Tech stack

| Technology    | Version | Purpose                          |
| ------------- | ------- | -------------------------------- |
| Next.js       | 16.2.6  | App framework, routing, SSR      |
| React         | 19.2.4  | UI library                       |
| TypeScript    | 5.x     | Type safety                      |
| Ant Design    | 6.4.3   | UI component library             |
| Redux Toolkit | 2.12.0  | Global state management examples |
| react-redux   | 9.3.0   | React bindings for Redux         |

### Public APIs used in examples

- **JSONPlaceholder** (`jsonplaceholder.typicode.com`) — users, posts, todos
- **PokéAPI** (`pokeapi.co`) — Pokémon list and search
- **DummyJSON** (`dummyjson.com`) — products and cart

---

## Project structure

```
app/
  page.tsx                      # Home page — module overview
  decision-guide/               # When to use what? (19 decision entries)
  hooks/
    use-state/easy|medium|advanced
    use-effect/easy|medium|advanced
    use-layout-effect/easy|medium|advanced
    use-ref/easy|medium|advanced
    use-memo/easy|medium|advanced
    use-callback/easy|medium|advanced
    use-reducer/easy|medium|advanced
  modern-hooks/
    use-transition/easy|medium|advanced
    use-deferred-value/easy|medium|advanced
    use-id/easy|medium|advanced
    use-optimistic/easy|medium|advanced
  react-19/
    use-hook/easy|medium|advanced
    use-action-state/easy|medium|advanced
    use-form-status/easy|medium|advanced
  custom-hooks/easy|medium|advanced
  context/easy|medium|advanced
  redux/easy|medium|advanced
  patterns/
    suspense/easy|medium|advanced
    error-boundary/easy|medium|advanced
    portals/easy|medium|advanced
    hoc/easy|medium|advanced
    render-props/easy|medium|advanced
    compound-components/easy|medium|advanced

components/
  layout/                       # AppSidebar, AppHeader, SectionLayout
  shared/                       # PageIntro, LevelBadge, LevelNavigator, ApiTag

lib/
  constants.ts                  # Level types, API URLs, module metadata
  navigation.ts                 # Full sidebar nav tree

services/                       # Typed API clients (JSONPlaceholder, PokéAPI, DummyJSON)
store/                          # Redux store, slices (counter, users, posts, cart)
types/                          # Shared TypeScript types (User, Post, Pokemon, Product)
```

---

## Author

Developed by **Malaka Sandakal**

- GitHub: [github.com/malakasandakalw](https://github.com/malakasandakalw)
- LinkedIn: [linkedin.com/in/malakasandakal](https://www.linkedin.com/in/malakasandakal/)

Built for educational purposes. For use within frontend development teams learning modern React.
