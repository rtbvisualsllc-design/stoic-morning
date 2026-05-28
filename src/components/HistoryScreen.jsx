import React from "react";

const HistoryScreen = ({ history, streak, totalCompletions, onBack }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="bg-texture" />

      {/* Header */}
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <button className="btn-ghost" onClick={onBack} style={{ padding: "4px 0", fontSize: "12px" }}>
            ← Back
          </button>
          <div className="streak-display">
            <span>🔥</span>
            <span>{streak} day streak</span>
          </div>
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: "1.1rem",
            fontWeight: "400",
            color: "var(--text-primary)",
            letterSpacing: "0.1em",
          }}
        >
          Morning History
        </h2>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          padding: "16px 24px",
          gap: "0",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <StatItem label="Total Mornings" value={totalCompletions} />
        <div style={{ width: "1px", background: "var(--border)", margin: "0 20px" }} />
        <StatItem label="Current Streak" value={`${streak}d`} color="var(--gold)" />
        <div style={{ width: "1px", background: "var(--border)", margin: "0 20px" }} />
        <StatItem label="Days Logged" value={history.length} />
      </div>

      {/* History list */}
      <div className="scroll-container" style={{ flex: 1, position: "relative", zIndex: 1 }}>
        {history.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.2rem",
                fontStyle: "italic",
                color: "var(--text-muted)",
                lineHeight: 1.7,
              }}
            >
              Your history will be written one morning at a time.
            </p>
            <p
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                marginTop: "12px",
              }}
            >
              BEGIN YOUR FIRST MORNING
            </p>
          </div>
        ) : (
          <div style={{ padding: "16px 24px 80px" }}>
            {history.map((entry, i) => (
              <HistoryEntry key={i} entry={entry} isFirst={i === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryEntry = ({ entry, isFirst }) => {
  const [expanded, setExpanded] = React.useState(isFirst);

  return (
    <div
      style={{
        marginBottom: "12px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        overflow: "hidden",
        transition: "border-color 0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Entry header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "16px 20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <div>
          <div
            className="font-display"
            style={{
              fontSize: "12px",
              letterSpacing: "0.08em",
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}
          >
            {entry.displayDate}
          </div>
          {entry.intention && (
            <div
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "0.9rem",
                fontStyle: "italic",
                color: "var(--text-muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "220px",
              }}
            >
              {entry.intention}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "10px",
              color: "var(--gold)",
              letterSpacing: "0.08em",
            }}
          >
            🔥 {entry.streak}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Entry detail */}
      {expanded && (
        <div
          style={{
            padding: "0 20px 20px",
            borderTop: "1px solid var(--border)",
            paddingTop: "16px",
          }}
        >
          {entry.intention && (
            <EntrySection label="Intention" value={entry.intention} color="var(--gold)" />
          )}
          {entry.battleReflection && (
            <EntrySection label="Battle Preparation" value={entry.battleReflection} color="var(--red)" />
          )}
          {entry.gratitude && entry.gratitude.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  color: "var(--amber)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  marginTop: "12px",
                }}
              >
                Gratitude
              </div>
              {entry.gratitude.map((g, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "0.95rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: "6px",
                    paddingLeft: "10px",
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
  );
};

const EntrySection = ({ label, value, color }) => (
  <div style={{ marginBottom: "8px" }}>
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
        fontSize: "0.95rem",
        color: "var(--text-secondary)",
        lineHeight: 1.6,
      }}
    >
      {value}
    </p>
  </div>
);

const StatItem = ({ label, value, color }) => (
  <div style={{ flex: 1, textAlign: "center" }}>
    <div
      className="font-display"
      style={{
        fontSize: "1.4rem",
        fontWeight: "400",
        color: color || "var(--text-secondary)",
        marginBottom: "4px",
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontFamily: "Cinzel, serif",
        fontSize: "9px",
        letterSpacing: "0.1em",
        color: "var(--text-muted)",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  </div>
);

export default HistoryScreen;
