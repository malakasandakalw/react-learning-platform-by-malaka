export type NavItem = {
  key: string;
  label: string;
  path: string;
  children?: NavItem[];
};

const levels: NavItem[] = [
  { key: "easy", label: "Easy", path: "easy" },
  { key: "medium", label: "Medium", path: "medium" },
  { key: "advanced", label: "Advanced", path: "advanced" },
];

function makeLevels(basePath: string): NavItem[] {
  return levels.map((l) => ({ ...l, path: `${basePath}/${l.path}` }));
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: "hooks",
    label: "Core Hooks",
    path: "/hooks",
    children: [
      {
        key: "use-state",
        label: "useState",
        path: "/hooks/use-state",
        children: makeLevels("/hooks/use-state"),
      },
      {
        key: "use-effect",
        label: "useEffect",
        path: "/hooks/use-effect",
        children: makeLevels("/hooks/use-effect"),
      },
      {
        key: "use-layout-effect",
        label: "useLayoutEffect",
        path: "/hooks/use-layout-effect",
        children: makeLevels("/hooks/use-layout-effect"),
      },
      {
        key: "use-ref",
        label: "useRef",
        path: "/hooks/use-ref",
        children: makeLevels("/hooks/use-ref"),
      },
      {
        key: "use-memo",
        label: "useMemo",
        path: "/hooks/use-memo",
        children: makeLevels("/hooks/use-memo"),
      },
      {
        key: "use-callback",
        label: "useCallback",
        path: "/hooks/use-callback",
        children: makeLevels("/hooks/use-callback"),
      },
      {
        key: "use-reducer",
        label: "useReducer",
        path: "/hooks/use-reducer",
        children: makeLevels("/hooks/use-reducer"),
      },
    ],
  },
  {
    key: "modern-hooks",
    label: "Modern Hooks",
    path: "/modern-hooks",
    children: [
      {
        key: "use-transition",
        label: "useTransition",
        path: "/modern-hooks/use-transition",
        children: makeLevels("/modern-hooks/use-transition"),
      },
      {
        key: "use-deferred-value",
        label: "useDeferredValue",
        path: "/modern-hooks/use-deferred-value",
        children: makeLevels("/modern-hooks/use-deferred-value"),
      },
      {
        key: "use-id",
        label: "useId",
        path: "/modern-hooks/use-id",
        children: makeLevels("/modern-hooks/use-id"),
      },
      {
        key: "use-optimistic",
        label: "useOptimistic",
        path: "/modern-hooks/use-optimistic",
        children: makeLevels("/modern-hooks/use-optimistic"),
      },
    ],
  },
  {
    key: "react-19",
    label: "React 19",
    path: "/react-19",
    children: [
      {
        key: "use-hook",
        label: "use()",
        path: "/react-19/use-hook",
        children: makeLevels("/react-19/use-hook"),
      },
      {
        key: "use-action-state",
        label: "useActionState",
        path: "/react-19/use-action-state",
        children: makeLevels("/react-19/use-action-state"),
      },
      {
        key: "use-form-status",
        label: "useFormStatus",
        path: "/react-19/use-form-status",
        children: makeLevels("/react-19/use-form-status"),
      },
    ],
  },
  {
    key: "custom-hooks",
    label: "Custom Hooks",
    path: "/custom-hooks",
    children: makeLevels("/custom-hooks"),
  },
  {
    key: "context",
    label: "Context API",
    path: "/context",
    children: makeLevels("/context"),
  },
  {
    key: "redux",
    label: "Redux Toolkit",
    path: "/redux",
    children: makeLevels("/redux"),
  },
  {
    key: "decision-guide",
    label: "When to use what?",
    path: "/decision-guide",
  },
  {
    key: "patterns",
    label: "Patterns",
    path: "/patterns",
    children: [
      {
        key: "suspense",
        label: "Suspense & lazy",
        path: "/patterns/suspense",
        children: makeLevels("/patterns/suspense"),
      },
      {
        key: "error-boundary",
        label: "Error Boundaries",
        path: "/patterns/error-boundary",
        children: makeLevels("/patterns/error-boundary"),
      },
      {
        key: "portals",
        label: "Portals",
        path: "/patterns/portals",
        children: makeLevels("/patterns/portals"),
      },
      {
        key: "hoc",
        label: "HOC",
        path: "/patterns/hoc",
        children: makeLevels("/patterns/hoc"),
      },
      {
        key: "render-props",
        label: "Render Props",
        path: "/patterns/render-props",
        children: makeLevels("/patterns/render-props"),
      },
      {
        key: "compound-components",
        label: "Compound Components",
        path: "/patterns/compound-components",
        children: makeLevels("/patterns/compound-components"),
      },
    ],
  },
];
