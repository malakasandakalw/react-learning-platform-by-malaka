"use client";

// useReducer: Advanced
// Concept: Multi-step checkout wizard with full navigation history.
// Complex state flows, like checkout, onboarding, or setup wizards, map
// naturally to a reducer. The reducer owns all transitions:
// NEXT, BACK, SET_STEP_DATA, COMPLETE. The history stack enables the BACK action.
// This is architecturally identical to how React Router or Redux manage navigation state.

import { useReducer } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Steps,
  Tag,
  Typography,
  Divider,
  Result,
} from "antd";
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

type CartItem = { name: string; price: number; qty: number };
type Address = { street: string; city: string; zip: string; country: string };
type Payment = { card: string; expiry: string; cvv: string };

type WizardData = {
  cart: CartItem[];
  address: Address;
  payment: Payment;
};

type Step = "cart" | "address" | "payment" | "complete";
const STEP_ORDER: Step[] = ["cart", "address", "payment", "complete"];

type WizardState = {
  currentStep: Step;
  history: Step[]; // breadcrumb stack for BACK action
  data: WizardData;
  orderNumber: string | null;
};

type WizardAction =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "GO_TO"; step: Step }
  | { type: "UPDATE_ADDRESS"; payload: Partial<Address> }
  | { type: "UPDATE_PAYMENT"; payload: Partial<Payment> }
  | { type: "UPDATE_QTY"; index: number; qty: number }
  | { type: "CONFIRM_ORDER" }
  | { type: "START_OVER" };

const initialData: WizardData = {
  cart: [
    { name: "Wireless Headphones", price: 79.99, qty: 1 },
    { name: "Phone Case", price: 19.99, qty: 2 },
    { name: "USB-C Cable", price: 12.99, qty: 3 },
  ],
  address: { street: "", city: "", zip: "", country: "US" },
  payment: { card: "", expiry: "", cvv: "" },
};

const initialState: WizardState = {
  currentStep: "cart",
  history: [],
  data: initialData,
  orderNumber: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "NEXT": {
      const idx = STEP_ORDER.indexOf(state.currentStep);
      if (idx >= STEP_ORDER.length - 1) return state;
      return {
        ...state,
        history: [...state.history, state.currentStep],
        currentStep: STEP_ORDER[idx + 1],
      };
    }
    case "BACK": {
      const prev = state.history[state.history.length - 1];
      if (!prev) return state;
      return {
        ...state,
        currentStep: prev,
        history: state.history.slice(0, -1),
      };
    }
    case "GO_TO":
      return {
        ...state,
        history: [...state.history, state.currentStep],
        currentStep: action.step,
      };
    case "UPDATE_ADDRESS":
      return {
        ...state,
        data: { ...state.data, address: { ...state.data.address, ...action.payload } },
      };
    case "UPDATE_PAYMENT":
      return {
        ...state,
        data: { ...state.data, payment: { ...state.data.payment, ...action.payload } },
      };
    case "UPDATE_QTY":
      return {
        ...state,
        data: {
          ...state.data,
          cart: state.data.cart.map((item, i) =>
            i === action.index ? { ...item, qty: action.qty } : item
          ),
        },
      };
    case "CONFIRM_ORDER":
      return {
        ...state,
        currentStep: "complete",
        orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}`,
      };
    case "START_OVER":
      return initialState;
    default:
      return state;
  }
}

const STEP_ICONS: Record<Step, React.ReactNode> = {
  cart: <ShoppingCartOutlined />,
  address: <EnvironmentOutlined />,
  payment: <CreditCardOutlined />,
  complete: <CheckCircleOutlined />,
};

export default function UseReducerAdvancedPage() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const total = state.data.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const stepIndex = STEP_ORDER.indexOf(state.currentStep);

  if (state.currentStep === "complete") {
    return (
      <div>
        <PageIntro
          sourcePath="app/hooks/use-reducer/advanced/page.tsx"
          title="useReducer"
          level="advanced"
          description="Multi-step wizards with navigation history are a natural fit for useReducer. Each step transition is an action; the history stack enables the BACK button."
          teaches={[
            "History stack: push current step on NEXT, pop on BACK",
            "GO_TO action for non-sequential navigation",
            "Complex nested state updates in one dispatch",
            "How Redux-style patterns emerge naturally from useReducer",
          ]}
        />
        <Result
          status="success"
          title={`Order ${state.orderNumber} Confirmed!`}
          subTitle={`Shipping to ${state.data.address.city || "your address"}`}
          extra={[
            <Button key="start" type="primary" onClick={() => dispatch({ type: "START_OVER" })}>
              Place another order
            </Button>,
          ]}
        />
        <LevelNavigator basePath="/hooks/use-reducer" currentLevel="advanced" />
      </div>
    );
  }

  return (
    <div>
      <PageIntro
        sourcePath="app/hooks/use-reducer/advanced/page.tsx"
        title="useReducer"
        level="advanced"
        description="Multi-step wizards with navigation history are a natural fit for useReducer. Each step transition is an action; the history stack enables the BACK button."
        teaches={[
          "History stack: push current step on NEXT, pop on BACK",
          "GO_TO action for non-sequential navigation",
          "Complex nested state updates in one dispatch",
          "How Redux-style patterns emerge naturally from useReducer",
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card style={{ borderRadius: 12 }}>
            <Steps
              current={stepIndex}
              items={STEP_ORDER.filter((s) => s !== "complete").map((s) => ({
                key: s,
                title: s.charAt(0).toUpperCase() + s.slice(1),
                icon: STEP_ICONS[s],
              }))}
              style={{ marginBottom: 28 }}
            />

            {/* Cart Step */}
            {state.currentStep === "cart" && (
              <div>
                <Title level={5}>Your Cart</Title>
                {state.data.cart.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <div>
                      <Text strong>{item.name}</Text>
                      <Text type="secondary" style={{ marginLeft: 8 }}>
                        ${item.price}
                      </Text>
                    </div>
                    <Space>
                      <InputNumber
                        value={item.qty}
                        min={1}
                        max={10}
                        size="small"
                        onChange={(v) => dispatch({ type: "UPDATE_QTY", index: i, qty: v ?? 1 })}
                      />
                      <Text>${(item.price * item.qty).toFixed(2)}</Text>
                    </Space>
                  </div>
                ))}
                <div style={{ textAlign: "right", marginTop: 12 }}>
                  <Text strong>Total: ${total.toFixed(2)}</Text>
                </div>
              </div>
            )}

            {/* Address Step */}
            {state.currentStep === "address" && (
              <div>
                <Title level={5}>Shipping Address</Title>
                <Space orientation="vertical" style={{ width: "100%" }} size={12}>
                  <Input
                    placeholder="Street address"
                    value={state.data.address.street}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_ADDRESS", payload: { street: e.target.value } })
                    }
                  />
                  <Input
                    placeholder="City"
                    value={state.data.address.city}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_ADDRESS", payload: { city: e.target.value } })
                    }
                  />
                  <Row gutter={12}>
                    <Col span={12}>
                      <Input
                        placeholder="ZIP code"
                        value={state.data.address.zip}
                        onChange={(e) =>
                          dispatch({ type: "UPDATE_ADDRESS", payload: { zip: e.target.value } })
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <Select
                        style={{ width: "100%" }}
                        value={state.data.address.country}
                        onChange={(v) =>
                          dispatch({ type: "UPDATE_ADDRESS", payload: { country: v } })
                        }
                        options={[
                          { value: "US", label: "United States" },
                          { value: "UK", label: "United Kingdom" },
                          { value: "AU", label: "Australia" },
                        ]}
                      />
                    </Col>
                  </Row>
                </Space>
              </div>
            )}

            {/* Payment Step */}
            {state.currentStep === "payment" && (
              <div>
                <Title level={5}>Payment Details</Title>
                <Space orientation="vertical" style={{ width: "100%" }} size={12}>
                  <Input
                    placeholder="Card number (16 digits)"
                    maxLength={16}
                    value={state.data.payment.card}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_PAYMENT", payload: { card: e.target.value } })
                    }
                  />
                  <Row gutter={12}>
                    <Col span={12}>
                      <Input
                        placeholder="MM/YY"
                        maxLength={5}
                        value={state.data.payment.expiry}
                        onChange={(e) =>
                          dispatch({ type: "UPDATE_PAYMENT", payload: { expiry: e.target.value } })
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <Input
                        placeholder="CVV"
                        maxLength={3}
                        type="password"
                        value={state.data.payment.cvv}
                        onChange={(e) =>
                          dispatch({ type: "UPDATE_PAYMENT", payload: { cvv: e.target.value } })
                        }
                      />
                    </Col>
                  </Row>
                  <Tag color="blue">Total to charge: ${total.toFixed(2)}</Tag>
                </Space>
              </div>
            )}

            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={() => dispatch({ type: "BACK" })}
                disabled={state.history.length === 0}
              >
                ← Back
              </Button>
              {state.currentStep === "payment" ? (
                <Button type="primary" onClick={() => dispatch({ type: "CONFIRM_ORDER" })}>
                  Confirm Order
                </Button>
              ) : (
                <Button type="primary" onClick={() => dispatch({ type: "NEXT" })}>
                  Continue →
                </Button>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="Wizard State"
            style={{ background: "#1e1e1e", border: "none", borderRadius: 8 }}
            styles={{
              header: { background: "#1e1e1e", color: "#d4d4d4", borderBottom: "1px solid #333" },
              body: { padding: 16 },
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 2,
                color: "#d4d4d4",
              }}
            >
              <div>
                <span style={{ color: "#569cd6" }}>currentStep: </span>
                <span style={{ color: "#ce9178" }}>{state.currentStep}</span>
              </div>
              <div>
                <span style={{ color: "#569cd6" }}>history: </span>
                <span style={{ color: "#d4d4d4" }}>[{state.history.join(", ")}]</span>
              </div>
              <Divider style={{ borderColor: "#333", margin: "8px 0" }} />
              <div style={{ color: "#569cd6" }}>address:</div>
              <pre style={{ margin: "0 0 0 8px", fontSize: 10, color: "#d4d4d4" }}>
                {JSON.stringify(state.data.address, null, 2)}
              </pre>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-reducer" currentLevel="advanced" />
    </div>
  );
}
