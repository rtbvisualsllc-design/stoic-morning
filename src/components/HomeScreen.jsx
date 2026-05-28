import React, { useEffect, useState } from "react";

const HomeScreen = ({
  streak,
  totalCompletions,
  todayCompleted,
  audioEnabled,
  onAudioToggle,
  onBegin,
  onViewHistory,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 6
      ? "The world is still asleep."
      : hour < 10
      ? "The morning awaits."
      : hour < 12
      ? "Begin before noon."
      : "It is never too late to rise.";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div className="bg-texture" />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          className="btn-ghost"
          onClick={onViewHistory}
          style={{ padding: "8px 0", fontSize: "12px", letterSpacing: "0.08em" }}
        >
          History
        </button>

        <button
          onClick={() => onAudioToggle(!audioEnabled)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: audioEnabled ? "var(--gold)" : "var(--text-muted)",
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
            transition: "color 0.2s",
          }}
        >
          {audioEnabled ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
          <span style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
            {audioEnabled ? "Audio On" : "Audio Off"}
          </span>
        </button>
      </div>

      {/* Main content */}
      <div
        style={{
          textAlign: "center",
          maxWidth: "360px",
          width: "100%",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Ornament */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              width: "1px",
              height: "50px",
              background: "linear-gradient(to bottom, transparent, var(--gold-dim))",
              margin: "0 auto 16px",
            }}
          />
          <span className="ornament" style={{ fontSize: "14px", letterSpacing: "12px" }}>
            ✦ ✦ ✦
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(1.6rem, 6vw, 2.2rem)",
            fontWeight: "400",
            color: "var(--text-primary)",
            letterSpacing: "0.15em",
            lineHeight: 1.2,
            marginBottom: "8px",
          }}
        >
          THE STOIC
        </h1>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(1.6rem, 6vw, 2.2rem)",
            fontWeight: "400",
            color: "var(--gold)",
            letterSpacing: "0.15em",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          MORNING
        </h1>

        {/* Date & greeting */}
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1rem",
            color: "var(--text-muted)",
            marginBottom: "4px",
            letterSpacing: "0.05em",
          }}
        >
          {today}
        </p>
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.1rem",
            fontStyle: "italic",
            color: "var(--text-secondary)",
            marginBottom: "40px",
          }}
        >
          {greeting}
        </p>

        {/* Streak & Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginBottom: "44px",
            padding: "20px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="font-display"
              style={{ fontSize: "1.8rem", color: "var(--gold)", fontWeight: "400" }}
            >
              {streak}
            </div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                fontFamily: "Cinzel, serif",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              Day Streak
            </div>
          </div>

          <div
            style={{
              width: "1px",
              background: "var(--border)",
              alignSelf: "stretch",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <div
              className="font-display"
              style={{ fontSize: "1.8rem", color: "var(--text-secondary)", fontWeight: "400" }}
            >
              {totalCompletions}
            </div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                fontFamily: "Cinzel, serif",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              Mornings
            </div>
          </div>

          <div
            style={{
              width: "1px",
              background: "var(--border)",
              alignSelf: "stretch",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <div
              className="font-display"
              style={{ fontSize: "1.8rem", color: todayCompleted ? "var(--green)" : "var(--amber)", fontWeight: "400" }}
            >
              {todayCompleted ? "✓" : "○"}
            </div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                fontFamily: "Cinzel, serif",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              Today
            </div>
          </div>
        </div>

        {/* Begin button */}
        <button className="btn-primary" onClick={onBegin}>
          {todayCompleted ? "Rise Again" : "Begin Your Morning"}
        </button>

        {/* Bottom quote */}
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "0.9rem",
            fontStyle: "italic",
            color: "var(--text-muted)",
            marginTop: "32px",
            lineHeight: 1.5,
          }}
        >
          "When you arise in the morning, think of what a precious privilege it is to be alive."
        </p>
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
            fontFamily: "Cinzel, serif",
            marginTop: "6px",
          }}
        >
          — MARCUS AURELIUS
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
