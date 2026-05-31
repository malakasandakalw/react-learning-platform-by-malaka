"use client";

// Context API: Advanced
// Concept: Context + useReducer, the pattern behind Redux.
// When context state is complex (multiple related values, many transitions),
// combine it with useReducer. The Provider holds the reducer; consumers dispatch
// actions. This is architecturally identical to Redux, just without the library.
// This example builds a mini shopping cart using this exact pattern.

import { createContext, useContext, useReducer } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

type CartItem = { id: number; name: string; price: number; qty: number };

type CartState = {
  items: CartItem[];
  discountPercent: number;
};

type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "qty"> }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "INCREMENT"; id: number }
  | { type: "DECREMENT"; id: number }
  | { type: "CLEAR" }
  | { type: "SET_DISCOUNT"; percent: number };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.item.id);
      return {
        ...state,
        items: existing
          ? state.items.map((i) => (i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i))
          : [...state.items, { ...action.item, qty: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i)),
      };
    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "SET_DISCOUNT":
      return { ...state, discountPercent: action.percent };
    default:
      return state;
  }
}

// Context holds BOTH state and dispatch: consumers can read AND update
type CartContextType = { state: CartState; dispatch: React.Dispatch<CartAction> };
const CartContext = createContext<CartContextType | null>(null);

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], discountPercent: 0 });
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

const PRODUCTS = [
  { id: 1, name: "React Handbook", price: 29.99 },
  { id: 2, name: "TypeScript Guide", price: 24.99 },
  { id: 3, name: "Next.js Course", price: 49.99 },
  { id: 4, name: "Redux Masterclass", price: 39.99 },
];

// Product catalog: dispatches ADD_ITEM
function ProductList() {
  const { state, dispatch } = useCart();
  return (
    <Card title="Products" style={{ borderRadius: 12 }}>
      <Space orientation="vertical" style={{ width: "100%" }}>
        {PRODUCTS.map((p) => {
          const inCart = state.items.find((i) => i.id === p.id);
          return (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #f5f5f5",
              }}
            >
              <div>
                <Text strong style={{ fontSize: 13 }}>
                  {p.name}
                </Text>
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                  ${p.price}
                </Text>
              </div>
              <Button
                size="small"
                type={inCart ? "default" : "primary"}
                icon={<PlusOutlined />}
                onClick={() => dispatch({ type: "ADD_ITEM", item: p })}
              >
                {inCart ? `Add (${inCart.qty})` : "Add"}
              </Button>
            </div>
          );
        })}
      </Space>
    </Card>
  );
}

// Cart panel: dispatches INCREMENT, DECREMENT, REMOVE_ITEM, CLEAR
function CartPanel() {
  const { state, dispatch } = useCart();
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = subtotal * (state.discountPercent / 100);
  const total = subtotal - discount;
  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <Card
      title={
        <Space>
          <Badge count={itemCount} size="small">
            <ShoppingCartOutlined style={{ fontSize: 18 }} />
          </Badge>
          <span>Cart</span>
        </Space>
      }
      style={{ borderRadius: 12 }}
      extra={
        state.items.length > 0 ? (
          <Button size="small" danger onClick={() => dispatch({ type: "CLEAR" })}>
            Clear
          </Button>
        ) : null
      }
    >
      {state.items.length === 0 ? (
        <Empty description="Your cart is empty" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <>
          {state.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #f5f5f5",
              }}
            >
              <div>
                <Text style={{ fontSize: 13 }}>{item.name}</Text>
                <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
                  × {item.qty}
                </Text>
              </div>
              <Space size={4}>
                <Text strong style={{ fontSize: 12, minWidth: 50, textAlign: "right" }}>
                  ${(item.price * item.qty).toFixed(2)}
                </Text>
                <Button
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() => dispatch({ type: "DECREMENT", id: item.id })}
                />
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => dispatch({ type: "INCREMENT", id: item.id })}
                />
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
                />
              </Space>
            </div>
          ))}

          <Divider style={{ margin: "12px 0" }} />

          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Discount:
            </Text>
            <Space size={4}>
              {[0, 10, 20].map((pct) => (
                <Tag
                  key={pct}
                  style={{ cursor: "pointer" }}
                  color={state.discountPercent === pct ? "purple" : "default"}
                  onClick={() => dispatch({ type: "SET_DISCOUNT", percent: pct })}
                >
                  {pct}%
                </Tag>
              ))}
            </Space>
          </Space>

          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Subtotal:</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </div>
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Discount:</Text>
                <Text type="success">-${discount.toFixed(2)}</Text>
              </div>
            )}
            <Divider style={{ margin: "8px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Total:</Text>
              <Text strong>${total.toFixed(2)}</Text>
            </div>
          </div>

          <Button type="primary" block style={{ marginTop: 16 }}>
            Checkout
          </Button>
        </>
      )}
    </Card>
  );
}

export default function ContextAdvancedPage() {
  return (
    <div>
      <PageIntro
        title="Context API"
        level="advanced"
        description="Context + useReducer is the foundational pattern that Redux is built on. The Provider owns the reducer. Consumers dispatch actions. The reducer owns all state transitions. This pattern scales to complex apps without any external library."
        teaches={[
          "Passing dispatch through context: consumers can trigger state changes",
          "The reducer owns all transitions with no state mutation in components",
          "Throwing in useCart() if used outside Provider is the safe guard pattern",
          "This is Redux without the library: same mental model, no extra deps",
        ]}
      />

      {/* CartProvider wraps the entire feature: all children share one cart state */}
      <CartProvider>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <ProductList />
          </Col>
          <Col xs={24} md={12}>
            <CartPanel />
          </Col>
        </Row>
      </CartProvider>

      <LevelNavigator basePath="/context" currentLevel="advanced" />
    </div>
  );
}
