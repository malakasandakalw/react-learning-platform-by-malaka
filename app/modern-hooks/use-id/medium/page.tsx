"use client";

// useId: Medium
// Concept: Dynamic list of form instances, each needing unique IDs.
// When you render a list of form components (like adding multiple contacts),
// you cannot use index-based IDs (id-0, id-1) because React may reorder them.
// useId inside each component instance generates a stable unique ID
// that is tied to that component's position in the tree.

import { useId, useState } from "react";
import { Button, Card, Col, Input, Row, Space, Typography, Tag } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

type Contact = { key: string; name: string; email: string; phone: string };

// Each ContactForm is a component instance: useId gives it unique IDs.
// These IDs are stable even if the list is reordered or items are removed.
function ContactForm({
  contact,
  onChange,
  onDelete,
  index,
}: {
  contact: Contact;
  onChange: (key: string, field: keyof Contact, value: string) => void;
  onDelete: (key: string) => void;
  index: number;
}) {
  // This useId is unique to THIS component instance, not the index.
  const id = useId();

  return (
    <Card
      size="small"
      title={
        <Space>
          <Tag color="default">Contact #{index + 1}</Tag>
          <Text type="secondary" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
            base id: {id}
          </Text>
        </Space>
      }
      extra={
        <Button
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(contact.key)}
        />
      }
      style={{ borderRadius: 8, marginBottom: 12 }}
    >
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={8}>
          {/* htmlFor and id are linked via the unique base id */}
          <label htmlFor={`${id}-name`} style={{ fontSize: 12, fontWeight: 500 }}>
            Full Name
          </label>
          <Input
            id={`${id}-name`}
            value={contact.name}
            onChange={(e) => onChange(contact.key, "name", e.target.value)}
            placeholder="Name"
            size="small"
          />
        </Col>
        <Col xs={24} sm={8}>
          <label htmlFor={`${id}-email`} style={{ fontSize: 12, fontWeight: 500 }}>
            Email
          </label>
          <Input
            id={`${id}-email`}
            value={contact.email}
            onChange={(e) => onChange(contact.key, "email", e.target.value)}
            placeholder="Email"
            size="small"
          />
        </Col>
        <Col xs={24} sm={8}>
          <label htmlFor={`${id}-phone`} style={{ fontSize: 12, fontWeight: 500 }}>
            Phone
          </label>
          <Input
            id={`${id}-phone`}
            value={contact.phone}
            onChange={(e) => onChange(contact.key, "phone", e.target.value)}
            placeholder="Phone"
            size="small"
          />
        </Col>
      </Row>
    </Card>
  );
}

let nextKey = 2;

export default function UseIdMediumPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    { key: "c1", name: "", email: "", phone: "" },
  ]);

  function addContact() {
    setContacts((prev) => [...prev, { key: `c${nextKey++}`, name: "", email: "", phone: "" }]);
  }

  function deleteContact(key: string) {
    setContacts((prev) => prev.filter((c) => c.key !== key));
  }

  function updateContact(key: string, field: keyof Contact, value: string) {
    setContacts((prev) => prev.map((c) => (c.key === key ? { ...c, [field]: value } : c)));
  }

  return (
    <div>
      <PageIntro
        sourcePath="app/modern-hooks/use-id/medium/page.tsx"
        title="useId"
        level="medium"
        description="When you dynamically render a list of form components, each component needs its own unique ID set for label/input pairing. useId generates these automatically. Each instance gets its own stable set tied to its position in the component tree."
        teaches={[
          "Each component instance calling useId gets its own unique base ID",
          "Derive sub-IDs: `${id}-name`, `${id}-email`, `${id}-phone`",
          "Never use list index as an ID: React can reorder, insert, and remove items",
          "useId is tied to component position in the tree and remains stable even on re-renders",
        ]}
      />

      <Row gutter={[24, 0]}>
        <Col xs={24} lg={17}>
          {contacts.map((contact, i) => (
            <ContactForm
              key={contact.key}
              contact={contact}
              onChange={updateContact}
              onDelete={deleteContact}
              index={i}
            />
          ))}

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addContact}
            block
            style={{ borderRadius: 8 }}
          >
            Add Contact
          </Button>
        </Col>

        <Col xs={24} lg={7}>
          <Card
            title="Why Not Index?"
            style={{ borderRadius: 12, background: "#1e1e1e", border: "none", marginTop: 0 }}
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
              <div style={{ color: "#ce9178" }}>// ❌ index-based IDs:</div>
              <div style={{ color: "#6a9955" }}>id-0, id-1, id-2</div>
              <div style={{ color: "#6a9955" }}>Delete item 0 →</div>
              <div style={{ color: "#ce9178" }}>id-0 now points to different element</div>
              <br />
              <div style={{ color: "#b5cea8" }}>// ✓ useId: tree-position based:</div>
              <div style={{ color: "#b5cea8" }}>:r0:, :r1:, :r2:</div>
              <div style={{ color: "#6a9955" }}>Delete item 0 →</div>
              <div style={{ color: "#b5cea8" }}>:r1: and :r2: unchanged ✓</div>
              <div
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  background: "#2d2d2d",
                  borderRadius: 6,
                  fontSize: 10,
                }}
              >
                <div style={{ color: "#569cd6" }}>Active contacts: {contacts.length}</div>
                <div style={{ color: "#6a9955" }}>Each has 3 unique IDs: name, email, phone</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/modern-hooks/use-id" currentLevel="medium" />
    </div>
  );
}
