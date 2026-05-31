"use client";

import { useState } from "react";
import { Alert, Collapse, Tag, Typography } from "antd";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────
type Verdict = "use" | "consider" | "avoid";

type Decision = {
  verdict: Verdict;
  concept: string;
  reason: string;
};

type GuideLink = {
  label: string;
  path: string;
};

type GuideEntry = {
  id: number;
  tag: string;
  tagColor: string;
  situation: string;
  context: string;
  decisions: Decision[];
  callout?: string;
  links: GuideLink[];
};

// ─── Guide content ────────────────────────────────────────────────────────────
const GUIDE: GuideEntry[] = [
  {
    id: 1,
    tag: "State Management",
    tagColor: "#4f46e5",
    situation: "Sharing data across many components: Context or Redux?",
    context:
      "You have data (a user session, a shopping cart, notification count) that many components spread across the tree need to read and update. You've heard both Context and Redux solve this. Which one do you reach for?",
    decisions: [
      {
        verdict: "use",
        concept: "Context API",
        reason:
          "When the data changes infrequently and the components that consume it are relatively few. Auth user, theme, locale, feature flags: these are set once and rarely mutate. Context is simple, built in, and perfect for ambient app-level data.",
      },
      {
        verdict: "use",
        concept: "Redux Toolkit",
        reason:
          "When the data is updated frequently from many unrelated places, or when state transitions are complex (async thunks, chained updates). The critical advantage: useSelector only re-renders the component when the selected slice changes. A cart item count updating won't re-render a component that only reads the user's name. Context has no equivalent. Every consumer re-renders whenever the context value changes.",
      },
      {
        verdict: "avoid",
        concept: "Context for high-frequency updates",
        reason:
          "Context has no selector mechanism. Putting a frequently-updated value (typed search query, real-time price feed, per-keystroke state) in Context will cascade re-renders to every consumer on every update. That is the exact reason a team lead might say 'use Redux here': not because Context is wrong in principle, but because the update frequency makes it the wrong tool.",
      },
    ],
    callout:
      "Rule of thumb: Context for 'ambient' data (theme, locale, auth). Redux for 'operational' data (cart, notifications, server-fetched entities that change at runtime).",
    links: [
      { label: "Context: Easy", path: "/context/easy" },
      { label: "Context: Advanced", path: "/context/advanced" },
      { label: "Redux: Easy", path: "/redux/easy" },
      { label: "Redux: Medium", path: "/redux/medium" },
    ],
  },
  {
    id: 2,
    tag: "Refs & DOM",
    tagColor: "#0891b2",
    situation: "Keeping a value alive across re-renders without causing one",
    context:
      "You need to hold onto something between renders: a timer ID, a WebSocket instance, an AbortController, or some other class instance you create once. If you put it in useState, updating it triggers a re-render (which you don't want). If you put it in a plain variable, it disappears on the next render.",
    decisions: [
      {
        verdict: "use",
        concept: "useRef",
        reason:
          "useRef returns a mutable box: { current: value }. Reading or writing ref.current never triggers a re-render. The value persists for the full lifetime of the component. This is the correct place for any imperative handle: AbortController, setInterval/setTimeout return values, WebSocket, ResizeObserver, media player instances, or the previous value of a prop for comparison.",
      },
      {
        verdict: "avoid",
        concept: "useState for imperative handles",
        reason:
          "Every setState call schedules a re-render. If you do setController(new AbortController()) to replace a controller, you force a render cycle with no visual benefit. useRef.current is a mutation, not a state update. That distinction is exactly what you need here.",
      },
      {
        verdict: "avoid",
        concept: "Module-level variables for per-instance state",
        reason:
          "A variable outside the component (let controller = ...) is shared across all mounted instances of that component. Two instances of <VideoPlayer> would clobber each other's controller. useRef is scoped to the component instance, exactly like an instance property on a class component.",
      },
    ],
    callout:
      "useRef is also for DOM nodes: ref={myRef} on a JSX element sets myRef.current to the DOM element after mount. Same mechanism, two common uses.",
    links: [
      { label: "useRef: Easy", path: "/hooks/use-ref/easy" },
      { label: "useRef: Medium", path: "/hooks/use-ref/medium" },
      { label: "useRef: Advanced", path: "/hooks/use-ref/advanced" },
    ],
  },
  {
    id: 3,
    tag: "Side Effects",
    tagColor: "#059669",
    situation: "Running code when something changes: effect or event handler?",
    context:
      "You want to do something when a value changes or when the component first appears: fetch data, start a timer, update localStorage, fire an analytics event. You know useEffect exists for this. But is useEffect always the right answer?",
    decisions: [
      {
        verdict: "use",
        concept: "Event handler",
        reason:
          "When the code runs because the user did something such as clicking a button, submitting a form, or typing in a field. Event handlers are synchronous, predictable, and don't have the stale-closure pitfalls of effects. 'Fetch data when the user clicks Search' belongs in the onClick handler, not a useEffect watching a query string.",
      },
      {
        verdict: "use",
        concept: "useEffect",
        reason:
          "When you need to synchronize your component with something external that lives outside React: a WebSocket subscription, a setInterval timer, a third-party DOM library, localStorage reads, or analytics SDKs. useEffect runs after every render (or when deps change) and lets you clean up when the component unmounts.",
      },
      {
        verdict: "avoid",
        concept: "useEffect to derive state from state",
        reason:
          "The most common overuse of useEffect: 'when X changes, compute Y and setY(...)'. This creates an extra render cycle for no reason. If Y can be computed from X, just compute it during render: const y = computeFrom(x). No effect needed. Effects are for synchronizing with the outside world, not for computing values from existing state.",
      },
    ],
    callout:
      "A useful mental check: if removing the effect would break synchronization with an external system, it belongs in useEffect. If it would just mean a button press does less, it belongs in an event handler.",
    links: [
      { label: "useEffect: Easy", path: "/hooks/use-effect/easy" },
      { label: "useEffect: Medium", path: "/hooks/use-effect/medium" },
      { label: "useEffect: Advanced", path: "/hooks/use-effect/advanced" },
    ],
  },
  {
    id: 4,
    tag: "Performance",
    tagColor: "#d97706",
    situation: "The UI feels sluggish: which optimization do I reach for?",
    context:
      "A component re-renders too often, a computation is slow, or the UI freezes while a heavy state update happens. You've heard useMemo, useCallback, React.memo, and useTransition all mentioned as performance tools. They are not interchangeable.",
    decisions: [
      {
        verdict: "use",
        concept: "useMemo: for expensive calculations",
        reason:
          "Wrap a computation that is provably slow: sorting 10,000 rows, building a complex derived data structure, running a regex across a large string. useMemo caches the result and recomputes only when dependencies change. Do not use it for simple arithmetic or string formatting. The memoization overhead exceeds the savings.",
      },
      {
        verdict: "consider",
        concept: "useCallback + React.memo: for stable child component renders",
        reason:
          "useCallback caches a function reference. On its own this does almost nothing visible because function identity rarely matters unless you are passing the function to a child wrapped in React.memo, or using it as a useEffect dependency. The pattern is: React.memo on the child to skip re-renders, useCallback on the parent to stabilize the prop. One without the other is usually pointless.",
      },
      {
        verdict: "use",
        concept: "useTransition: for heavy state updates that freeze the UI",
        reason:
          "When updating state triggers a visually slow re-render (re-filtering 50,000 list items), startTransition marks that update as low-priority. React will keep the current UI interactive (text inputs keep responding) and work on the expensive render in the background. This is a React 18 concurrency feature, specifically a scheduling tool rather than a caching tool.",
      },
      {
        verdict: "consider",
        concept: "useDeferredValue: when you cannot control the update",
        reason:
          "Like useTransition, but you defer a value instead of an update. Use it when the state comes from a parent as a prop and you can't wrap it in startTransition. The component renders twice: first with the stale (fast) value, then with the fresh (expensive) value. Provides the same responsiveness benefit as useTransition from the receiving end.",
      },
    ],
    callout:
      "Profile before you optimize. React DevTools Profiler will show you which component re-renders and why. Most slowness is not from missing memoization. It typically comes from unnecessary state, bad component structure, or fetch waterfalls.",
    links: [
      { label: "useMemo: Advanced", path: "/hooks/use-memo/advanced" },
      { label: "useCallback: Advanced", path: "/hooks/use-callback/advanced" },
      { label: "useTransition: Easy", path: "/modern-hooks/use-transition/easy" },
      { label: "useTransition: Medium", path: "/modern-hooks/use-transition/medium" },
      { label: "useDeferredValue: Easy", path: "/modern-hooks/use-deferred-value/easy" },
    ],
  },
  {
    id: 5,
    tag: "State Shape",
    tagColor: "#7c3aed",
    situation: "Form or feature state is getting complicated: useState or useReducer?",
    context:
      "You start with a few useState calls. Then the component grows and you have isLoading, isError, data, validationErrors, retryCount, and updating them together is becoming error-prone. You've heard useReducer exists but aren't sure when the switch makes sense.",
    decisions: [
      {
        verdict: "use",
        concept: "useState",
        reason:
          "For 1–3 independent values that don't update together. Simple booleans, a single string input, a selected tab index. If each piece of state changes independently and the new value doesn't depend on the old shape, useState is cleaner.",
      },
      {
        verdict: "use",
        concept: "useReducer",
        reason:
          "When multiple values always transition together as part of one logical operation. 'Start fetching' means isLoading: true, error: null, data: null simultaneously. That is one transition, not three setStates. useReducer names these transitions ({ type: 'FETCH_START' }) making the logic readable and testable as a pure function independent of React.",
      },
      {
        verdict: "avoid",
        concept: "Spreading state manually with useState",
        reason:
          "Writing setState({ ...state, field: value }) repeatedly is a signal you're building a reducer by hand without the structure. Whenever you find yourself writing three setState calls in a row to handle one user action, that action is a dispatch waiting to happen.",
      },
    ],
    callout:
      "useReducer and Redux are not the same thing. useReducer is a local hook. The state stays in that component. Redux is a global store shared across the whole app. Use useReducer for complex local state; use Redux when that state needs to be globally shared.",
    links: [
      { label: "useReducer: Easy", path: "/hooks/use-reducer/easy" },
      { label: "useReducer: Advanced", path: "/hooks/use-reducer/advanced" },
    ],
  },
  {
    id: 6,
    tag: "Code Sharing",
    tagColor: "#b45309",
    situation: "The same logic lives in multiple components: how do I share it?",
    context:
      "You have stateful logic (fetch + loading + error handling, debounced input, scroll position tracking) that appears in several components. You want to extract it once. The options of custom hooks, HOC, and render props all seem to do something similar.",
    decisions: [
      {
        verdict: "use",
        concept: "Custom Hook",
        reason:
          "The modern default. Any stateful logic that contains no JSX belongs in a custom hook. useFetch, useDebounce, and useWindowSize are all pure composable logic. Custom hooks can use any other hook internally, so they compose naturally. If you are not sure which to use, start here.",
      },
      {
        verdict: "consider",
        concept: "Higher Order Component (HOC)",
        reason:
          "When the shared logic must render additional JSX around the wrapped component. withAuth(Page) renders a redirect for unauthenticated users. That is a rendering concern, not just logic. HOCs are still valid for cross-cutting rendering concerns like auth gates, analytics wrappers, or loading overlays applied uniformly.",
      },
      {
        verdict: "consider",
        concept: "Render Props",
        reason:
          "When you are building a component that provides some state/behavior and the consumer needs full control over what gets rendered with it. MouseTracker and DataFetcher are examples where the component handles the data and the consumer decides the UI. Useful in library design. In application code, a custom hook achieves the same result with less nesting.",
      },
    ],
    callout:
      "A practical test: can the shared logic be called at the top of a function component like a hook? If yes, make it a custom hook. If the shared thing is 'wrap this component with a loading state' (rendering concern), consider a HOC.",
    links: [
      { label: "Custom Hooks: Easy", path: "/custom-hooks/easy" },
      { label: "HOC: Easy", path: "/patterns/hoc/easy" },
      { label: "HOC: Advanced", path: "/patterns/hoc/advanced" },
      { label: "Render Props: Medium", path: "/patterns/render-props/medium" },
      { label: "Render Props: Advanced", path: "/patterns/render-props/advanced" },
    ],
  },
  {
    id: 7,
    tag: "Component Design",
    tagColor: "#0f766e",
    situation: "Building a component with cooperating sub-parts (Tabs, Accordion, Select)",
    context:
      "You are building a reusable UI component that has multiple sub-parts: Tabs with Tab buttons and Panels, an Accordion with Items, or a Select with Options. Each sub-part needs to know about shared state (which tab is active, which item is open) but you don't want callers to wire everything up manually.",
    decisions: [
      {
        verdict: "use",
        concept: "Compound Components",
        reason:
          "The parent (Tabs, Accordion) owns the shared state and provides it via Context. Sub-components (Tabs.Tab, Tabs.Panel) consume the context and never receive the shared state as props. Callers just compose the sub-components naturally, like HTML elements. The wiring is invisible to them. This is the standard pattern for any component library or design system element.",
      },
      {
        verdict: "avoid",
        concept: "Passing shared state as props to each sub-component",
        reason:
          "Callers would need to write activeTab and onChange on every Tab and Panel. That is prop drilling by design. The caller manages state that the component should manage internally. Compound components are the fix for this exact problem.",
      },
      {
        verdict: "avoid",
        concept: "HOC for this use case",
        reason:
          "HOCs enhance a single component. They have no mechanism for two different components (Tab and Panel) to share the same state instance. When you need multiple cooperating components to share implicit state, Context + compound components is the right tool.",
      },
    ],
    callout:
      "Ant Design's Select + Option, Radio.Group + Radio, and Form + Form.Item are all compound components. You have been using this pattern already. Now you can build it yourself.",
    links: [
      { label: "Compound Components: Easy", path: "/patterns/compound-components/easy" },
      { label: "Compound Components: Medium", path: "/patterns/compound-components/medium" },
      { label: "Compound Components: Advanced", path: "/patterns/compound-components/advanced" },
    ],
  },
  {
    id: 8,
    tag: "DOM & Layers",
    tagColor: "#9333ea",
    situation: "Rendering a modal, tooltip, or toast that must escape its parent's overflow",
    context:
      "A modal or tooltip needs to appear above everything else on the page. But if you render it inside a component that has overflow: hidden or a stacking context, the modal gets clipped. You need to render the UI outside the parent DOM node while keeping it inside the React component tree so props and context still flow.",
    decisions: [
      {
        verdict: "use",
        concept: "createPortal",
        reason:
          "createPortal(children, document.body) renders the JSX into a different DOM node (usually document.body) while keeping it in the React component tree. This means: the portal's children still receive context from their React ancestors, events still bubble through the React tree (not the DOM tree), and the component that mounts the portal still controls its lifecycle. All of Ant Design's Modal, Drawer, Tooltip, and Dropdown use portals internally.",
      },
      {
        verdict: "avoid",
        concept: "Fixed positioning alone",
        reason:
          "position: fixed can visually escape overflow: hidden, but it does not fix stacking context issues (transform on an ancestor breaks fixed positioning) and it does not move the DOM node. For genuine 'render outside the current DOM tree' requirements, a portal is the correct solution.",
      },
    ],
    links: [
      { label: "Portals: Easy", path: "/patterns/portals/easy" },
      { label: "Portals: Medium", path: "/patterns/portals/medium" },
      { label: "Portals: Advanced", path: "/patterns/portals/advanced" },
    ],
  },
  {
    id: 9,
    tag: "Async UI",
    tagColor: "#dc2626",
    situation: "Showing instant feedback before the server confirms an action",
    context:
      "A user clicks 'Like', adds an item to a cart, or sends a message. The server request takes 300–800ms. If you wait for the response before updating the UI, the app feels slow. You want to immediately show the expected result and silently correct it if the server rejects the action.",
    decisions: [
      {
        verdict: "use",
        concept: "useOptimistic (React 19)",
        reason:
          "useOptimistic accepts the real state and a transformation function. While an async operation is in flight, it returns the optimistically-updated value so the UI shows it immediately. Once the async operation settles (success or error), React automatically reverts to the actual state. Rollback is built in and you do not manage it manually.",
      },
      {
        verdict: "consider",
        concept: "useTransition around the update",
        reason:
          "startTransition is useful alongside optimistic updates to keep the UI responsive if the server response triggers a heavy re-render. But useTransition alone is a scheduling tool and does not provide the 'show expected state now, roll back if it fails' behavior that useOptimistic is specifically designed for.",
      },
      {
        verdict: "avoid",
        concept: "Manual optimistic state with useState",
        reason:
          "You can implement optimistic UI with useState + try/catch + manual rollback. This works but requires you to handle every error case yourself and keep the optimistic state in sync with the real state. useOptimistic handles this automatically in React 19.",
      },
    ],
    links: [
      { label: "useOptimistic: Easy", path: "/modern-hooks/use-optimistic/easy" },
      { label: "useOptimistic: Advanced", path: "/modern-hooks/use-optimistic/advanced" },
      { label: "useTransition: Advanced", path: "/modern-hooks/use-transition/advanced" },
    ],
  },
  {
    id: 10,
    tag: "Data Fetching",
    tagColor: "#7c3aed",
    situation: "Loading async data when a component first renders",
    context:
      "A component needs data from an API before it can render meaningfully. You need a loading state while the request is in flight, an error state if it fails, and the real data when it arrives. There are at least three different ways to do this in React.",
    decisions: [
      {
        verdict: "use",
        concept: "useEffect + useState (universal pattern)",
        reason:
          "Fetch inside useEffect with an empty dependency array. Manage loading, error, and data with useState or useReducer. This works in every React version and is universally understood. The downside: you repeat the same loading/error boilerplate in every component that fetches. And if the same component mounts twice, two requests fire simultaneously with no built-in deduplication.",
      },
      {
        verdict: "use",
        concept: "use() + Suspense (React 19)",
        reason:
          "Pass a Promise to the use() hook. React suspends the component until the Promise resolves, and the nearest Suspense boundary shows the fallback during loading. No manual loading state, no if (loading) return <Spinner> inside the component. The loading UI lives in the parent's Suspense boundary, not scattered through every leaf component.",
      },
      {
        verdict: "consider",
        concept: "A dedicated data-fetching library (TanStack Query, SWR)",
        reason:
          "For production apps with many fetches, these libraries provide caching, background refetching, stale-while-revalidate, deduplication, and pagination out of the box. Writing all of that with useEffect is possible but takes significant effort. If data fetching is a major part of the app, a library pays off quickly.",
      },
      {
        verdict: "avoid",
        concept: "Async function directly in useEffect",
        reason:
          "useEffect's callback cannot be async (it returns a cleanup function, not a Promise). Writing async function fetchData() { ... } fetchData() inside the effect is correct. Writing useEffect(async () => { ... }) looks like it works but silently swallows cleanup and creates subtle race conditions.",
      },
    ],
    callout:
      "Race condition: if deps change quickly (fast typing triggering a fetch per keystroke), multiple requests can be in-flight at once and resolve out of order. Use an AbortController in useRef to abort the previous request when a new one starts.",
    links: [
      { label: "useEffect: Medium", path: "/hooks/use-effect/medium" },
      { label: "useEffect: Advanced", path: "/hooks/use-effect/advanced" },
      { label: "use(): Easy", path: "/react-19/use-hook/easy" },
      { label: "use(): Medium", path: "/react-19/use-hook/medium" },
    ],
  },
  {
    id: 11,
    tag: "Error Handling",
    tagColor: "#b91c1c",
    situation: "An error in one component crashes the entire page",
    context:
      "A third-party library throws, an API returns unexpected data, or a prop has an unexpected shape. React renders nothing. The whole page goes blank. You need to contain the damage so only the broken section fails, while the rest of the page keeps working.",
    decisions: [
      {
        verdict: "use",
        concept: "Error Boundary",
        reason:
          "A component that catches JavaScript errors thrown anywhere in its child tree and renders a fallback UI instead. Wrap each major independent section of the app (the sidebar, a dashboard widget, the main content area) in its own Error Boundary so a single failure is isolated. The boundary catches the error, logs it, and shows a fallback. The rest of the app continues rendering.",
      },
      {
        verdict: "use",
        concept: "Multiple narrow boundaries over one wide one",
        reason:
          "One boundary at the app root catches everything but shows a full-page error screen for a minor failure in one widget. Multiple boundaries around independent sections mean a broken chart does not kill the navigation. The granularity of your boundaries defines the granularity of your failures.",
      },
      {
        verdict: "avoid",
        concept: "try/catch inside render to handle rendering errors",
        reason:
          "React's reconciler throws errors that cannot be caught by a try/catch inside a function component's render. try/catch works correctly in event handlers and useEffect callbacks. For errors thrown during rendering such as wrong prop type, null dereference, or unexpected API shape, Error Boundaries are the only mechanism.",
      },
    ],
    callout:
      "Error Boundaries do NOT catch errors inside event handlers (use try/catch there), inside async code in useEffect (catch inside the async function), or in server components. They only catch synchronous rendering errors in their child tree.",
    links: [
      { label: "Error Boundary: Easy", path: "/patterns/error-boundary/easy" },
      { label: "Error Boundary: Medium", path: "/patterns/error-boundary/medium" },
      { label: "Error Boundary: Advanced", path: "/patterns/error-boundary/advanced" },
    ],
  },
  {
    id: 12,
    tag: "State Architecture",
    tagColor: "#1d4ed8",
    situation: "Two sibling components need to share or react to the same state",
    context:
      "A search input is in a Header component. A product list below it should filter based on what the user types. They are siblings and neither owns the other. You cannot pass props directly between siblings in React.",
    decisions: [
      {
        verdict: "use",
        concept: "Lift state up",
        reason:
          "Move the shared state to the closest common ancestor. The ancestor owns the state and passes it down as props. This is the React-idiomatic answer and should always be the first approach. If threading props through 2–3 intermediate levels is uncomfortable, that is still fine. Prop drilling through a few levels is not a problem that needs solving.",
      },
      {
        verdict: "consider",
        concept: "Context",
        reason:
          "If lifting state up requires passing props through 5+ intermediate components that do not use the data themselves, which is true prop drilling, extract the state into Context. But reach for this only when the drilling is genuinely painful. Context is an escape hatch, not the default.",
      },
      {
        verdict: "avoid",
        concept: "Redux for state that is local to one section",
        reason:
          "If the shared state is only relevant to one section of the app (a dashboard panel, a multi-step flow), putting it in the global Redux store is over-engineering. Redux is for state that must be accessed from truly unrelated, distant parts of the app.",
      },
      {
        verdict: "avoid",
        concept: "Calling functions on siblings via refs",
        reason:
          "Patterns where Component A calls a method on Component B via a ref or an event emitter bypass React's data flow entirely. They are impossible to trace in React DevTools and break the mental model. Lifting state up is almost always cleaner.",
      },
    ],
    callout:
      "React's data flow is deliberately one-way: parent → child via props. Sibling communication works by routing through a shared parent. If the parent is far away, Context is the right escape hatch, not refs, events, or global state.",
    links: [
      { label: "Context: Easy", path: "/context/easy" },
      { label: "Context: Medium", path: "/context/medium" },
    ],
  },
  {
    id: 13,
    tag: "Persistence",
    tagColor: "#6b7280",
    situation: "State resets to default when the user refreshes the page",
    context:
      "Filter selections, UI preferences (collapsed sidebar, chosen theme), a partially filled form, all live in useState. On refresh, React re-mounts and everything is gone. The user has to redo their work.",
    decisions: [
      {
        verdict: "use",
        concept: "localStorage + useEffect (or useLocalStorage custom hook)",
        reason:
          "Read the initial value from localStorage in useState's initializer function. Sync changes back to localStorage in a useEffect. Wrapping this in a custom hook gives you useLocalStorage('key', default) that behaves exactly like useState but survives page refreshes. Works for preferences, UI state, and small data.",
      },
      {
        verdict: "use",
        concept: "URL search params for filter/sort state",
        reason:
          "State that describes the current view such as active filters, sort order, and selected tab belongs in the URL, not localStorage. URL state is bookmarkable, shareable, and survives refresh by definition. Use Next.js router's searchParams (or the Web URL API) for state that should also be linkable.",
      },
      {
        verdict: "avoid",
        concept: "Storing auth tokens or sensitive data in localStorage",
        reason:
          "localStorage is readable by any JavaScript running on the page, including injected scripts from third-party libraries. Never store JWTs, session tokens, or sensitive user data there. Use httpOnly cookies (inaccessible to JavaScript) for anything security-sensitive.",
      },
    ],
    callout:
      "localStorage is synchronous and blocks the main thread for large reads/writes. For large objects or structured data, IndexedDB is more appropriate. For most UI preferences (a string or a small object), localStorage is the pragmatic choice.",
    links: [
      { label: "Custom Hooks: Easy", path: "/custom-hooks/easy" },
      { label: "useEffect: Medium", path: "/hooks/use-effect/medium" },
    ],
  },
  {
    id: 14,
    tag: "DOM & Layout",
    tagColor: "#be185d",
    situation: "Reading a DOM element's size or position causes a visible flicker",
    context:
      "You are building a tooltip that positions itself relative to its trigger, a sticky element that measures its own height, or a component that reads getBoundingClientRect() to calculate layout. Reading the DOM in a regular useEffect works, but you sometimes see a flicker where the element first renders in the wrong position, then jumps.",
    decisions: [
      {
        verdict: "use",
        concept: "useLayoutEffect",
        reason:
          "Runs synchronously after React updates the DOM but before the browser paints. This is the correct window to read layout measurements and update state based on them. The state update triggered inside useLayoutEffect happens before the first paint, so the user never sees the intermediate (wrong-position) state.",
      },
      {
        verdict: "avoid",
        concept: "useEffect for DOM measurements that feed into layout",
        reason:
          "useEffect runs after the browser has already painted. Reading a DOM measurement and then setting state causes two paint cycles: first paint with the wrong/default value, state update, second paint with the corrected value. That gap is the flicker. useLayoutEffect eliminates the first incorrect paint.",
      },
      {
        verdict: "consider",
        concept: "ResizeObserver inside useEffect for ongoing tracking",
        reason:
          "If you need to track an element's size as it changes over time (responsive dropdowns, drag handles), attach a ResizeObserver in useEffect and disconnect it on cleanup. This is a subscription to change events, so useEffect is the right place. useLayoutEffect is only needed for the initial synchronous measurement.",
      },
    ],
    callout:
      "Start with useEffect. Only switch to useLayoutEffect if you observe a visible flicker caused by a DOM measurement driving a state update. The React team recommends using useLayoutEffect sparingly because it blocks the browser from painting until it completes.",
    links: [
      { label: "useEffect: Advanced", path: "/hooks/use-effect/advanced" },
    ],
  },
  {
    id: 15,
    tag: "Component API",
    tagColor: "#0891b2",
    situation: "A parent needs to call a method on a child component (focus, reset, scroll)",
    context:
      "You have a SearchInput component. Clicking a button in the parent should focus it. Or a WizardForm that the parent must reset when the user navigates back. The parent needs to trigger an imperative action inside the child. Props flow the wrong direction for this.",
    decisions: [
      {
        verdict: "use",
        concept: "forwardRef + useImperativeHandle",
        reason:
          "forwardRef lets a component accept a ref from its parent. useImperativeHandle defines exactly what the parent can access on that ref: a focus() method, a reset() method, or a getValues() function. The parent calls ref.current.focus() without knowing anything about the child's internal DOM structure. The component's public API is explicit and intentional.",
      },
      {
        verdict: "avoid",
        concept: "Passing a ref directly to the child's root DOM element",
        reason:
          "Without useImperativeHandle, a forwarded ref points straight to the DOM node. The parent can call any DOM API on it, not just what you intended. This leaks implementation details. If you later change the internal DOM structure (wrap the input in a div), the parent's ref silently breaks. useImperativeHandle creates a stable, controlled API instead.",
      },
      {
        verdict: "avoid",
        concept: "Using a prop flag for imperative commands",
        reason:
          "Patterns like <Form shouldReset={resetFlag} /> where the parent flips a boolean to trigger a reset require the child to watch for the flag changing, reset it via a callback, and handle edge cases (what if it was already true?). This turns a command into poorly-modeled state. useImperativeHandle expresses the intent clearly.",
      },
    ],
    callout:
      "forwardRef + useImperativeHandle is intentionally rare. Most parent–child communication should flow through props and callbacks. Reserve this pattern for genuinely imperative, one-shot actions such as focus, scroll, play/pause, and reset. These are commands, not state.",
    links: [
      { label: "useRef: Advanced", path: "/hooks/use-ref/advanced" },
    ],
  },
  {
    id: 16,
    tag: "Forms",
    tagColor: "#059669",
    situation: "A form with async submission, server validation, and loading states is getting messy",
    context:
      "A login or registration form. While submitting, the button should disable and show a spinner. On failure, each field should show the server's error message. On success, navigate or show confirmation. Managing all this with individual useState calls leads to bugs where isLoading and isError can both be true simultaneously.",
    decisions: [
      {
        verdict: "use",
        concept: "useReducer with a state machine",
        reason:
          "isLoading, isError, errorMessage, and isSuccess are not independent. They are states of one state machine: idle → submitting → success / error. useReducer with named transitions (SUBMIT_START, SUBMIT_SUCCESS, SUBMIT_ERROR) makes the logic explicit, testable as a pure function, and impossible to reach an invalid combination of flags.",
      },
      {
        verdict: "use",
        concept: "useActionState + useFormStatus (React 19)",
        reason:
          "Ties an async action function directly to the form. The action receives current state and FormData, returns the new state. Loading is tracked automatically. useFormStatus inside submit buttons and field components reads isPending without prop threading. The cleanest approach in React 19 apps.",
      },
      {
        verdict: "avoid",
        concept: "Separate useState for isLoading, isError, data, message",
        reason:
          "Four independent boolean/string states can reach impossible combinations (isLoading: true AND isError: true). Every code path must update all of them in the right order. Forgetting one setState call creates hard-to-reproduce bugs. These values form a single state machine, so model them as one.",
      },
    ],
    callout:
      "The simplest reliable pattern: one useReducer with four states ('idle', 'loading', 'success', 'error'). Each transition updates all related values atomically. No impossible states possible.",
    links: [
      { label: "useReducer: Easy", path: "/hooks/use-reducer/easy" },
      { label: "useReducer: Advanced", path: "/hooks/use-reducer/advanced" },
      { label: "useActionState: Easy", path: "/react-19/use-action-state/easy" },
      { label: "useFormStatus: Easy", path: "/react-19/use-form-status/easy" },
    ],
  },
  {
    id: 17,
    tag: "Code Splitting",
    tagColor: "#0f766e",
    situation: "A page or component is large and slows down the initial load for everyone",
    context:
      "Your app's main JavaScript bundle has grown too large. Users wait several seconds before seeing anything, even on pages that do not use the heavy code. One route (a rich text editor, a PDF preview, a complex chart) is responsible for most of the bundle size.",
    decisions: [
      {
        verdict: "use",
        concept: "React.lazy + Suspense",
        reason:
          "React.lazy(() => import('./HeavyComponent')) tells the bundler to split that component into a separate chunk. React downloads it only when the component is actually needed. Suspense wraps it with a fallback shown during the download. Users who never visit that route never download that code.",
      },
      {
        verdict: "use",
        concept: "Dynamic import() for non-component modules",
        reason:
          "For heavy non-component code (a PDF parser, an image processing library, a syntax highlighter), use a plain dynamic import() in an event handler or inside useEffect: const lib = await import('heavy-lib'). This defers the download to the moment the code is actually needed, not the moment the page loads.",
      },
      {
        verdict: "avoid",
        concept: "Splitting every small component",
        reason:
          "Code splitting has overhead: the browser makes an extra network request for each chunk. Splitting a 2KB component saves nothing and costs a round-trip. Split at route boundaries and at genuinely heavy third-party dependencies, not at every component boundary.",
      },
    ],
    callout:
      "Code splitting improves load time (download size). It is a separate concern from render performance (useMemo, useTransition). If the page loads fast but interactions feel slow, look at re-render optimization rather than code splitting.",
    links: [
      { label: "Suspense: Easy", path: "/patterns/suspense/easy" },
      { label: "Suspense: Medium", path: "/patterns/suspense/medium" },
      { label: "Suspense: Advanced", path: "/patterns/suspense/advanced" },
    ],
  },
  {
    id: 18,
    tag: "Common Pitfalls",
    tagColor: "#b91c1c",
    situation: "A useEffect runs on every render, or causes an infinite re-render loop",
    context:
      "The component re-renders, useEffect fires, it updates state, that triggers another render, useEffect fires again. Or an effect you expected to run once runs on every render. The dependency array is the most misunderstood part of useEffect.",
    decisions: [
      {
        verdict: "use",
        concept: "Empty array []: run once on mount",
        reason:
          "useEffect(fn, []) runs after the component mounts and the cleanup runs on unmount. Use this for: subscriptions that should exist for the component's entire lifetime, one-time DOM setup, initial data fetch that never needs to re-run. It does not mean 'run once globally'. It means once per component instance.",
      },
      {
        verdict: "use",
        concept: "Specific deps [val1, val2]: run when these values change",
        reason:
          "The effect re-runs whenever any listed value changes (by reference equality). This is the most common form. List every value from the component scope that the effect uses. The ESLint rule react-hooks/exhaustive-deps tells you what is missing.",
      },
      {
        verdict: "avoid",
        concept: "Objects or arrays created inline as dependencies",
        reason:
          "useEffect(fn, [{ page: 1 }]) creates a new object every render. React compares deps by reference. A new object is always considered different, so the effect fires every render. Move the object outside the component, memoize it with useMemo, or extract the primitive values you actually need (useEffect(fn, [page])).",
      },
      {
        verdict: "avoid",
        concept: "Functions defined inline as dependencies",
        reason:
          "A function defined inside the component is a new reference every render. As a dep it triggers the effect every render. Fix: move the function outside the component (if it needs no component scope), or stabilize it with useCallback. But first ask: does the effect actually need to depend on this function, or can it be restructured to avoid the dep?",
      },
    ],
    callout:
      "If adding a dep causes an infinite loop, the fix is almost never to remove the dep because that suppresses the symptom and creates stale closure bugs. The real fix is to stabilize the value (useCallback, useMemo, or restructure) so it does not change on every render.",
    links: [
      { label: "useEffect: Easy", path: "/hooks/use-effect/easy" },
      { label: "useEffect: Medium", path: "/hooks/use-effect/medium" },
      { label: "useEffect: Advanced", path: "/hooks/use-effect/advanced" },
      { label: "useCallback: Advanced", path: "/hooks/use-callback/advanced" },
    ],
  },
  {
    id: 19,
    tag: "Accessibility",
    tagColor: "#6366f1",
    situation: "Input labels and aria-* attributes need unique, stable IDs",
    context:
      "Accessibility requires that a label's htmlFor matches its input's id. If you render the same component multiple times on one page, each instance must have a different ID. And in server-rendered apps, the IDs generated on the server must exactly match those on the client or React's hydration breaks.",
    decisions: [
      {
        verdict: "use",
        concept: "useId",
        reason:
          "Generates a stable, unique ID that is consistent between server render and client hydration. Call it once: const id = useId(). Use it directly or with suffixes for multiple fields: `${id}-email`, `${id}-password`. Every component instance gets its own unique ID automatically.",
      },
      {
        verdict: "avoid",
        concept: "Math.random() for IDs",
        reason:
          "Math.random() produces a different value on the server and on the client. React's hydration compares the server-rendered HTML with what the client renders. A mismatched ID attribute causes a hydration error and forces a full client-side re-render, defeating the point of SSR.",
      },
      {
        verdict: "avoid",
        concept: "Module-level auto-incrementing counter",
        reason:
          "let nextId = 0 increments at module load time. In server-side rendering, the counter runs independently on the server and client and they fall out of sync quickly across requests. Different React tree traversal order can also produce different values between server and client.",
      },
      {
        verdict: "avoid",
        concept: "Hardcoded string IDs",
        reason:
          "Works for a single instance. The moment a second instance of the same component appears on the page, both share the same ID. The label then clicks the first matching input regardless of which form the user is interacting with. useId is zero-effort and correct.",
      },
    ],
    links: [
      { label: "useId: Easy", path: "/modern-hooks/use-id/easy" },
      { label: "useId: Medium", path: "/modern-hooks/use-id/medium" },
    ],
  },
];

const VERDICT_ALERT_TYPE: Record<Verdict, "success" | "warning" | "error"> = {
  use: "success",
  consider: "warning",
  avoid: "error",
};

const VERDICT_LABEL: Record<Verdict, string> = {
  use: "Use this",
  consider: "Use when",
  avoid: "Don't default to",
};

// ─── Panel body ───────────────────────────────────────────────────────────────
function EntryBody({ entry }: { entry: GuideEntry }) {
  return (
    <div>
      <Paragraph style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(0,0,0,0.65)", lineHeight: 1.75 }}>
        {entry.context}
      </Paragraph>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: entry.callout ? 12 : 0 }}>
        {entry.decisions.map((d, i) => (
          <Alert
            key={i}
            type={VERDICT_ALERT_TYPE[d.verdict]}
            showIcon
            title={
              <span>
                <Text strong style={{ fontSize: 13 }}>{VERDICT_LABEL[d.verdict]}: </Text>
                <Text style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}>{d.concept}</Text>
              </span>
            }
            description={<Text style={{ fontSize: 13 }}>{d.reason}</Text>}
          />
        ))}
      </div>

      {entry.callout && (
        <Alert
          type="info"
          showIcon
          title={<Text style={{ fontSize: 13 }}>{entry.callout}</Text>}
        />
      )}

      {entry.links.length > 0 && (
        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>See it in practice:</Text>
          {entry.links.map((link) => (
            <Link key={link.path} href={link.path} style={{ textDecoration: "none" }}>
              <Text style={{ fontSize: 12, color: "#1677ff", fontFamily: "var(--font-mono)", cursor: "pointer" }}>
                {link.label} →
              </Text>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DecisionGuidePage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(GUIDE.map((e) => e.tag)));
  const filtered = activeTag ? GUIDE.filter((e) => e.tag === activeTag) : GUIDE;

  const collapseItems = filtered.map((entry) => ({
    key: String(entry.id),
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Text type="secondary" style={{ fontSize: 11, minWidth: 18 }}>{entry.id}.</Text>
        <Tag color={entry.tagColor} style={{ margin: 0 }}>{entry.tag}</Tag>
        <Text strong style={{ fontSize: 13, lineHeight: 1.4 }}>{entry.situation}</Text>
      </div>
    ),
    children: <EntryBody entry={entry} />,
  }));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>When to use what?</Title>
        <Paragraph style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", margin: "0 0 16px" }}>
          Organized around the <strong>situation you are in</strong>, not the API name.
          When you are confused, you rarely know the name of what you need.
          Each entry describes a real scenario, then explains which React tool to reach for and which to avoid.
        </Paragraph>
        <Alert
          type="warning"
          showIcon
          title="Read the situation title first. If it does not match what you are facing, skip it. Wrong-situation advice is worse than no advice."
        />
      </div>

      {/* Tag filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <Tag
          onClick={() => setActiveTag(null)}
          style={{ cursor: "pointer", padding: "4px 12px", fontSize: 12, borderRadius: 20, fontWeight: activeTag === null ? 600 : 400, background: activeTag === null ? "#1677ff" : undefined, color: activeTag === null ? "#fff" : undefined, borderColor: activeTag === null ? "#1677ff" : undefined }}
        >
          All ({GUIDE.length})
        </Tag>
        {allTags.map((tag) => {
          const entry = GUIDE.find((e) => e.tag === tag)!;
          const isActive = activeTag === tag;
          return (
            <Tag
              key={tag}
              onClick={() => setActiveTag(isActive ? null : tag)}
              style={{ cursor: "pointer", padding: "4px 12px", fontSize: 12, borderRadius: 20, fontWeight: isActive ? 600 : 400, background: isActive ? entry.tagColor : undefined, color: isActive ? "#fff" : undefined, borderColor: isActive ? entry.tagColor : undefined }}
            >
              {tag}
            </Tag>
          );
        })}
      </div>

      <Collapse
        items={collapseItems}
        accordion={false}
        style={{ background: "#fff" }}
      />

      <div style={{ marginTop: 24 }}>
        <Alert
          type="info"
          showIcon
          title="These are not absolute rules."
          description="React gives you many tools that overlap by design. The decisions above describe the common case. Your specific constraints such as team conventions, library choices, and performance requirements may justify a different call. Understanding why a tool is recommended is more valuable than memorizing which one wins."
        />
      </div>
    </div>
  );
}
