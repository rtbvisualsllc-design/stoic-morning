import React, { useEffect, useState } from "react";
import { closingAffirmations } from "../data/steps";

const ClosingScreen = ({ streak, sessionData, onHome }) => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const affirmation = closingAffirmations[(streak - 1) % closingAffirmations.length];

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

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
        textAlign: "center",
      }}
    >
      <div className="bg-texture" />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(201, 168, 76, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "360px",
          width: "100%",
          position: "relative",
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Sun icon */}
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>🌅</div>

        {/* Streak */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 24px",
            background: "rgba(201, 168, 76, 0.1)",
            border: "1px solid rgba(201, 168, 76, 0.3)",
            borderRadius: "30px",
            marginBottom: "28px",
          }}
        >
          <span style={{ color: "var(--gold)", fontSize: "18px" }}>🔥</span>
          <span
            className="font-display"
            style={{ color: "var(--gold)", fontSize: "14px", letterSpacing: "0.1em" }}
          >
            {streak} Day Streak
          </span>
        </div>

        {/* Title */}
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.3rem, 5vw, 1.7rem)",
            fontWeight: "400",
            color: "var(--text-primary)",
            letterSpacing: "0.1em",
            lineHeight: 1.3,
            marginBottom: "8px",
          }}
        >
          Morning Complete
        </h2>

        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            marginBottom: "32px",
            letterSpacing: "0.04em",
          }}
        >
          {today}
        </p>

        {/* Affirmation */}
        <div
          style={{
            padding: "24px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--gold)",
            borderRadius: "4px",
            marginBottom: "28px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.15rem",
              fontStyle: "italic",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            {affirmation}
          </p>
        </div>

        {/* Session summary toggle */}
        {(sessionData.intention || sessionData.battleReflection || sessionData.gratitude1) && (
          <div style={{ marginBottom: "28px" }}>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn-secondary"
              style={{ width: "100%", maxWidth: "340px" }}
            >
              {showDetails ? "Hide" : "Review"} Today's Reflections
            </button>

            {showDetails && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "20px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  textAlign: "left",
                }}
              >
                {sessionData.intention && (
                  <SummaryItem
                    label="Today's Intention"
                    value={sessionData.intention}
                    color="var(--gold)"
                  />
                )}
                {sessionData.battleReflection && (
                  <SummaryItem
                    label="Battle Preparation"
                    value={sessionData.battleReflection}
                    color="var(--red)"
                  />
                )}
                {(sessionData.gratitude1 || sessionData.gratitude2 || sessionData.gratitude3) && (
                  <div>
                    <div
                      style={{
                        fontFamily: "Cinzel, serif",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        color: "var(--amber)",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                        marginTop: "16px",
                      }}
                    >
                      Gratitude
                    </div>
                    {[sessionData.gratitude1, sessionData.gratitude2, sessionData.gratitude3]
                      .filter(Boolean)
                      .map((g, i) => (
                        <p
                          key={i}
                          style={{
                            fontFamily: "Cormorant Garamond, serif",
                            fontSize: "1rem",
                            color: "var(--text-secondary)",
                            lineHeight: 1.6,
                            marginBottom: "8px",
                            paddingLeft: "12px",
                            borderLeft: "1px solid var(--border)",
                          }}
                        >
                          {g}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Closing quote */}
        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <div className="divider" style={{ marginBottom: "20px" }} />
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "0.95rem",
              fontStyle: "italic",
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            "The impediment to action advances action. What stands in the way becomes the way."
          </p>
          <p
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              marginTop: "8px",
            }}
          >
            — MARCUS AURELIUS
          </p>
        </div>

        <button className="btn-primary" onClick={onHome}>
          Go Claim Your Day
        </button>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value, color }) => (
  <div style={{ marginBottom: "12px" }}>
    <div
      style={{
        fontFamily: "Cinzel, serif",
        fontSize: "9px",
        letterSpacing: "0.15em",
        color: color || "var(--gold-dim)",
        textTransform: "uppercase",
        marginBottom: "6px",
      }}
    >
      {label}
    </div>
    <p
      style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "1rem",
        color: "var(--text-secondary)",
        lineHeight: 1.6,
      }}
    >
      {value}
    </p>
  </div>
);

export default ClosingScreen;
