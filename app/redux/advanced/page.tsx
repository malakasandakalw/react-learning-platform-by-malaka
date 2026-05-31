"use client";

// Redux Toolkit: Advanced
// Concept: Multiple slices working together in one store.
// The app has a products slice (async data from DummyJSON) and a cart slice (local state).
// Components read from whichever slice they need via useAppSelector.
// Slices never directly communicate with each other. They share the same store,
// and components compose state from multiple selectors.
// This is the architecture used in production Redux applications.

import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  InputNumber,
  Row,
  Spin,
  Statistic,
  Typography,
} from "antd";
import { ShoppingCartOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, removeFromCart, updateQuantity, clearCart } from "@/store/slices/cartSlice";
import { getProducts } from "@/services/dummyJson";
import type { Product } from "@/types/product";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text } = Typography;

export default function ReduxAdvancedPage() {
  const dispatch = useAppDispatch();

  // Reading from the cart slice
  const cartItems = useAppSelector((state) => state.cart.items);

  // Local state for products (to avoid adding another async slice for this demo)
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    getProducts(12).then((data) => {
      setProducts(data.products);
      setLoadingProducts(false);
    });
  }, []);

  // Derived state: computed from cart slice
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <PageIntro
        sourcePath="app/redux/advanced/page.tsx"
        title="Redux Toolkit"
        level="advanced"
        apiUsed="DummyJSON"
        description="Multiple slices in one store. The products data comes from DummyJSON. The cart state lives in cartSlice. Components compose state from both slices via useAppSelector. Each slice owns its domain and components connect them."
        teaches={[
          "Multiple slices in configureStore({ reducer: { a, b, c } })",
          "Selectors compose: read from multiple slices in one component",
          "Cart slice handles local CRUD: addToCart, removeFromCart, updateQuantity",
          "Derived state from store: total, count computed with reduce()",
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* Product Grid */}
        <Col xs={24} lg={15}>
          <Card title="Products" style={{ borderRadius: 12 }}>
            {loadingProducts ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin />
              </div>
            ) : (
              <Row gutter={[12, 12]}>
                {products.map((product) => {
                  const inCart = cartItems.find((i) => i.id === product.id);
                  return (
                    <Col xs={12} sm={8} key={product.id}>
                      <div
                        style={{
                          border: `1.5px solid ${inCart ? "#91caff" : "#f0f0f0"}`,
                          borderRadius: 10,
                          padding: 10,
                          background: inCart ? "#e6f4ff" : "#fff",
                          transition: "all 0.2s",
                        }}
                      >
                        <Avatar
                          src={product.thumbnail}
                          size={40}
                          shape="square"
                          style={{ borderRadius: 6, marginBottom: 6 }}
                        />
                        <Text
                          strong
                          style={{ display: "block", fontSize: 11, marginBottom: 2 }}
                          ellipsis
                        >
                          {product.title}
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 600 }}>${product.price}</Text>
                        <Button
                          size="small"
                          block
                          style={{ marginTop: 6 }}
                          type={inCart ? "default" : "primary"}
                          icon={<PlusOutlined />}
                          onClick={() => dispatch(addToCart(product))}
                        >
                          {inCart ? `In cart (${inCart.quantity})` : "Add"}
                        </Button>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Card>
        </Col>

        {/* Cart */}
        <Col xs={24} lg={9}>
          <Card
            title={
              <Badge count={cartCount} size="small">
                <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 8 }}>
                  <ShoppingCartOutlined />
                  <span>Cart</span>
                </div>
              </Badge>
            }
            extra={
              cartItems.length > 0 ? (
                <Button size="small" danger onClick={() => dispatch(clearCart())}>
                  Clear
                </Button>
              ) : null
            }
            style={{ borderRadius: 12, position: "sticky", top: 80 }}
          >
            {cartItems.length === 0 ? (
              <Empty description="No items" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <Avatar
                        src={item.thumbnail}
                        size={36}
                        shape="square"
                        style={{ borderRadius: 4, flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <Text style={{ fontSize: 11, fontWeight: 500, display: "block" }} ellipsis>
                          {item.title}
                        </Text>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}
                        >
                          <InputNumber
                            size="small"
                            min={1}
                            max={10}
                            value={item.quantity}
                            onChange={(v) =>
                              dispatch(updateQuantity({ id: item.id, quantity: v ?? 1 }))
                            }
                            style={{ width: 60 }}
                          />
                          <Text style={{ fontSize: 11, fontWeight: 600 }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => dispatch(removeFromCart(item.id))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Divider style={{ margin: "12px 0" }} />

                <Row gutter={[0, 8]}>
                  <Col span={12}>
                    <Statistic
                      title={<span style={{ fontSize: 11 }}>Items</span>}
                      value={cartCount}
                      styles={{ value: { fontSize: 20 } }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={<span style={{ fontSize: 11 }}>Total</span>}
                      value={cartTotal.toFixed(2)}
                      prefix="$"
                      styles={{ value: { fontSize: 20 } }}
                    />
                  </Col>
                </Row>

                <Button type="primary" block style={{ marginTop: 12 }}>
                  Checkout
                </Button>
              </>
            )}
          </Card>

          {/* Store architecture panel */}
          <Card
            title="Store Architecture"
            style={{ borderRadius: 8, background: "#1e1e1e", border: "none", marginTop: 16 }}
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
              <div style={{ color: "#dcdcaa" }}>configureStore({"{"}</div>
              <div style={{ paddingLeft: 16 }}>reducer: {"{"}</div>
              <div style={{ paddingLeft: 32, color: "#b5cea8" }}>counter: counterReducer,</div>
              <div style={{ paddingLeft: 32, color: "#ce9178" }}>users: usersReducer,</div>
              <div style={{ paddingLeft: 32, color: "#569cd6" }}>posts: postsReducer,</div>
              <div style={{ paddingLeft: 32, color: "#d4d4d4" }}>cart: cartReducer,</div>
              <div style={{ paddingLeft: 16 }}>{"}"}</div>
              <div style={{ color: "#dcdcaa" }}>{"}"});</div>
              <div
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  background: "#2d2d2d",
                  borderRadius: 6,
                }}
              >
                <div>
                  cart.items: <span style={{ color: "#b5cea8" }}>{cartItems.length}</span>
                </div>
                <div>
                  cart.total: <span style={{ color: "#ce9178" }}>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/redux" currentLevel="advanced" />
    </div>
  );
}
