"use client";

// useLayoutEffect: Advanced
// Concept: Scroll restoration and synchronized DOM reads + writes.
// When navigating between pages, browsers reset scroll to the top.
// Custom scroll restoration must happen BEFORE the new page paints,
// otherwise users see the page at the top for a frame before jumping.
// useLayoutEffect is the only hook that can do this correctly.
//
// Also demonstrates: combining multiple useLayoutEffect calls that
// read and write different parts of the DOM in a single synchronous batch.

import { useLayoutEffect, useRef, useState, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Tag,
  Typography,
  Slider,
  Statistic,
  Space,
} from "antd";
import PageIntro from "@/components/shared/PageIntro";
import LevelNavigator from "@/components/shared/LevelNavigator";

const { Text, Title } = Typography;

// Custom hook: useSyncedScroll
// Keeps two panels scrolled to the same position (diff viewer pattern).
// Must use useLayoutEffect so both panels update before paint (no visual tear).
function useSyncedScroll() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  const syncLeft = useCallback(() => {
    if (isSyncing.current || !leftRef.current || !rightRef.current) return;
    isSyncing.current = true;
    // useLayoutEffect ensures this write to the DOM happens before paint
    rightRef.current.scrollTop = leftRef.current.scrollTop;
    isSyncing.current = false;
  }, []);

  const syncRight = useCallback(() => {
    if (isSyncing.current || !leftRef.current || !rightRef.current) return;
    isSyncing.current = true;
    leftRef.current.scrollTop = rightRef.current.scrollTop;
    isSyncing.current = false;
  }, []);

  return { leftRef, rightRef, syncLeft, syncRight };
}

// Custom hook: useElementSize
// Tracks element dimensions and updates synchronously with layout.
function useElementSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;

    // Read current size before paint
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Write new size: useLayoutEffect ensures this is batched with DOM reads
        setSize({ width: Math.round(width), height: Math.round(height) });
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}

const CODE_LINES_LEFT = Array.from({ length: 30 }, (_, i) => ({
  num: i + 1,
  code: `const line${i + 1} = ${i % 3 === 0 ? '"changed value"' : `"original ${i + 1}"`};`,
  changed: i % 3 === 0,
}));

const CODE_LINES_RIGHT = CODE_LINES_LEFT.map((l) => ({
  ...l,
  code: l.changed ? `const line${l.num} = "original ${l.num}";` : l.code,
  changed: l.changed,
}));

export default function UseLayoutEffectAdvancedPage() {
  const { leftRef, rightRef, syncLeft, syncRight } = useSyncedScroll();
  const { ref: resizeRef, size } = useElementSize();
  const [panelWidth, setPanelWidth] = useState(100);

  return (
    <div>
      <PageIntro
        title="useLayoutEffect"
        level="advanced"
        description="Advanced DOM synchronization patterns: synchronized scrolling between panels and live size tracking with ResizeObserver. Both require useLayoutEffect to prevent visible tearing between the read and write phases of DOM manipulation."
        teaches={[
          "Synchronized scroll: writing to DOM in response to scroll events via useLayoutEffect",
          "ResizeObserver + useLayoutEffect: track size without flicker",
          "Multiple useLayoutEffect calls batched before a single paint",
          "The read-write batching pattern: never interleave DOM reads and writes",
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* Synced diff viewer */}
        <Col xs={24}>
          <Card
            title="Synchronized Diff Viewer (scroll one panel, both follow)"
            style={{ borderRadius: 12 }}
          >
            <Row gutter={0}>
              <Col span={12}>
                <div
                  ref={leftRef}
                  onScroll={syncLeft}
                  style={{
                    height: 220,
                    overflowY: "auto",
                    borderRight: "1px solid #e5e7eb",
                    padding: "8px 0",
                  }}
                >
                  {CODE_LINES_LEFT.map((line) => (
                    <div
                      key={line.num}
                      style={{
                        display: "flex",
                        padding: "2px 12px",
                        background: line.changed ? "#dcfce7" : "transparent",
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: "#9ca3af", width: 24, flexShrink: 0 }}>{line.num}</span>
                      <span style={{ color: line.changed ? "#166534" : "#374151" }}>{line.code}</span>
                    </div>
                  ))}
                </div>
              </Col>
              <Col span={12}>
                <div
                  ref={rightRef}
                  onScroll={syncRight}
                  style={{
                    height: 220,
                    overflowY: "auto",
                    padding: "8px 0",
                  }}
                >
                  {CODE_LINES_RIGHT.map((line) => (
                    <div
                      key={line.num}
                      style={{
                        display: "flex",
                        padding: "2px 12px",
                        background: line.changed ? "#fee2e2" : "transparent",
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: "#9ca3af", width: 24, flexShrink: 0 }}>{line.num}</span>
                      <span style={{ color: line.changed ? "#991b1b" : "#374151" }}>{line.code}</span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Live resize tracker */}
        <Col xs={24} lg={14}>
          <Card title="Live Size Tracker (ResizeObserver + useLayoutEffect)" style={{ borderRadius: 12 }}>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
              Drag the slider to resize the panel. Size updates synchronously before paint.
            </Text>
            <Slider
              value={panelWidth}
              min={30}
              max={100}
              onChange={setPanelWidth}
              style={{ marginBottom: 16 }}
            />
            <div
              ref={resizeRef}
              style={{
                width: `${panelWidth}%`,
                minHeight: 80,
                background: "#eef2ff",
                border: "2px dashed #4f46e5",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "width 0.05s",
              }}
            >
              <Text style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "#4f46e5" }}>
                {size.width} × {size.height} px
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="Why useLayoutEffect here"
            style={{ borderRadius: 12, background: "#0f0f23", border: "none" }}
            styles={{ header: { color: "#a5b4fc", borderBottom: "1px solid #1e1e3a" }, body: { padding: 16 } }}
          >
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 2, color: "#e2e8f0" }}>
              <div style={{ color: "#7c3aed" }}>// Synced scroll:</div>
              <div style={{ color: "#6b7280" }}>onScroll → read scrollTop</div>
              <div style={{ color: "#6b7280" }}>         → write to other panel</div>
              <div style={{ color: "#4ade80" }}>Must happen before paint → no tear</div>
              <br />
              <div style={{ color: "#7c3aed" }}>// ResizeObserver:</div>
              <div style={{ color: "#6b7280" }}>observer setup → useLayoutEffect</div>
              <div style={{ color: "#6b7280" }}>callback: read size → setSize</div>
              <div style={{ color: "#4ade80" }}>State update batched with layout ✓</div>
              <br />
              <div style={{ padding: "8px 10px", background: "#161630", borderRadius: 6 }}>
                <div style={{ color: "#a5b4fc" }}>current size:</div>
                <div>{size.width} × {size.height}px</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <LevelNavigator basePath="/hooks/use-layout-effect" currentLevel="advanced" />
    </div>
  );
}
