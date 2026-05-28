import React, { useState, useEffect, useRef } from "react";
import { useSpeech } from "../hooks/useSpeech";
import { dailyWisdom } from "../data/steps";

const TimerCircle = ({ seconds, total, color }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = seconds / total;
  const offset = circumference * (1 - progress);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{ position: "relative", width: "140px", height: "140px", margin: "0 auto" }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Background ring */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="3"
        />
        {/* Progress ring */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color || "var(--gold)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className="font-display"
          style={{ fontSize: "1.8rem", color: "var(--text-primary)", fontWeight: "400" }}
        >
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

const AudioButton = ({ isPlaying, isPaused, onPlay, onPause, onResume, disabled }) => {
  if (!isPlaying && !isPaused) {
    return (
      <button
        className="audio-btn"
        onClick={onPlay}
        disabled={disabled}
        style={{ opacity: disabled ? 0.4 : 1 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <span>Listen</span>
      </button>
    );
  }
  if (isPaused) {
    return (
      <button className="audio-btn" onClick={onResume}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <span>Resume</span>
      </button>
    );
  }
  return (
    <button className="audio-btn speaking" onClick={onPause}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </svg>
      <span>Pause</span>
    </button>
  );
};

const StepScreen = ({ step, stepIndex, totalSteps, audioEnabled, onComplete, onHome }) => {
  const [phase, setPhase] = useState("teaching"); // teaching | action
  const [timerSeconds, setTimerSeconds] = useState(step.duration || 0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef(null);
  const halfwayFired = useRef(false);
  const speech = useSpeech();

  const todayWisdom = dailyWisdom[new Date().getDay() % dailyWisdom.length];

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    setPhase("teaching");
    setTimerSeconds(step.duration || 0);
    setTimerRunning(false);
    setTimerDone(false);
    setInputValues({});
    halfwayFired.current = false;
    speech.stop();
    return () => {
      speech.stop();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line
  }, [step.id]);

  // Auto-speak on teaching phase if audio enabled
  useEffect(() => {
    if (phase === "teaching" && audioEnabled && step.audioText) {
      const timer = setTimeout(() => {
        speech.speak(step.audioText);
      }, 600);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [phase, step.id]);

  // Timer logic
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev - 1;

          // Halfway check
          if (!halfwayFired.current && next <= Math.floor(step.duration / 2)) {
            halfwayFired.current = true;
            if (audioEnabled && step.timerAudio?.halfway) {
              speech.stop();
              setTimeout(() => speech.speak(step.timerAudio.halfway), 500);
            }
          }

          if (next <= 0) {
            setTimerRunning(false);
            setTimerDone(true);
            if (audioEnabled && step.timerAudio?.done) {
              speech.stop();
              setTimeout(() => speech.speak(step.timerAudio.done), 500);
            }
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning, timerSeconds, step, audioEnabled, speech]);

  const handleTeachingComplete = () => {
    speech.stop();
    setPhase("action");
    // For timer steps, start timer
    if (step.type === "timer") {
      setTimerRunning(true);
      if (audioEnabled && step.audioText) {
        // Audio was already played in teaching; don't replay
      }
    }
  };

  const handleComplete = () => {
    speech.stop();
    const data = {};
    if (step.key === "battle") data.battleReflection = inputValues.prompt || "";
    if (step.key === "intention") data.intention = inputValues.prompt || "";
    if (step.key === "gratitude") {
      data.gratitude1 = inputValues.g0 || "";
      data.gratitude2 = inputValues.g1 || "";
      data.gratitude3 = inputValues.g2 || "";
    }
    onComplete(data);
  };

  const canAdvanceFromAction = () => {
    if (step.type === "timer") return timerDone;
    if (step.type === "reflection") return true;
    if (step.type === "intention") return true;
    if (step.type === "gratitude") return true;
    if (step.type === "wisdom") return true;
    return true;
  };

  const progressPercent = ((stepIndex + (phase === "action" ? 0.7 : 0.3)) / totalSteps) * 100;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div className="bg-texture" />

      {/* Header */}
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <button className="btn-ghost" onClick={onHome} style={{ padding: "4px 0", fontSize: "12px" }}>
            ← Home
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Step {stepIndex + 1} of {totalSteps}
            </span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="scroll-container" style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <div style={{ padding: "28px 24px 120px" }}>
          {/* Step header */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span style={{ fontSize: "28px" }}>{step.icon}</span>
              <div>
                <div
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    color: step.color,
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  Step {stepIndex + 1}
                </div>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(1rem, 4.5vw, 1.25rem)",
                    fontWeight: "400",
                    color: "var(--text-primary)",
                    letterSpacing: "0.06em",
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </h2>
              </div>
            </div>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1rem",
                fontStyle: "italic",
                color: "var(--text-secondary)",
              }}
            >
              {step.subtitle}
            </p>
          </div>

          {phase === "teaching" && (
            <TeachingPhase
              step={step}
              todayWisdom={todayWisdom}
              audioEnabled={audioEnabled}
              speech={speech}
              onNext={handleTeachingComplete}
            />
          )}

          {phase === "action" && (
            <ActionPhase
              step={step}
              todayWisdom={todayWisdom}
              timerSeconds={timerSeconds}
              timerRunning={timerRunning}
              timerDone={timerDone}
              inputValues={inputValues}
              setInputValues={setInputValues}
              audioEnabled={audioEnabled}
              speech={speech}
              canAdvance={canAdvanceFromAction()}
              onComplete={handleComplete}
              onToggleTimer={() => setTimerRunning((r) => !r)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TeachingPhase = ({ step, todayWisdom, audioEnabled, speech, onNext }) => {
  return (
    <div>
      {/* Audio button */}
      {audioEnabled && (
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
          <AudioButton
            isPlaying={speech.isSpeaking}
            isPaused={speech.isPaused}
            onPlay={() => speech.speak(step.audioText)}
            onPause={speech.pause}
            onResume={speech.resume}
          />
        </div>
      )}

      {/* Who practiced this */}
      <InfoCard
        label="Who Practiced This"
        color={step.color}
        icon="⚡"
        content={step.who}
        style={{ marginBottom: "16px" }}
      />

      {/* What they did */}
      <InfoCard
        label="What They Did"
        color={step.color}
        icon="📜"
        content={step.whatTheyDid}
        style={{ marginBottom: "16px" }}
      />

      {/* Why it matters */}
      <InfoCard
        label="Why This Matters"
        color={step.color}
        icon="🔥"
        content={step.whyMatters}
        style={{ marginBottom: "16px" }}
      />

      {/* The goal */}
      <InfoCard
        label="The Goal"
        color={step.color}
        icon="🎯"
        content={step.goal}
        style={{ marginBottom: "24px" }}
      />

      {/* Key Quote */}
      <div
        style={{
          padding: "24px",
          background: "var(--bg-card)",
          border: `1px solid ${step.color}30`,
          borderLeft: `3px solid ${step.color}`,
          borderRadius: "4px",
          marginBottom: "28px",
        }}
      >
        <p className="stoic-quote" style={{ fontSize: "1.2rem" }}>
          "{step.keyQuote}"
        </p>
        <p className="quote-author" style={{ marginTop: "12px" }}>
          — {step.keyQuoteAuthor}
        </p>
      </div>

      {/* Practice intro */}
      <div
        style={{
          padding: "20px",
          background: "rgba(201, 168, 76, 0.05)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "9px",
            letterSpacing: "0.15em",
            color: "var(--gold-dim)",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          The Practice
        </div>
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
          }}
        >
          {step.practice}
        </p>
      </div>

      <button className="btn-primary" onClick={onNext} style={{ display: "block", margin: "0 auto" }}>
        {step.actionLabel || "I'm ready. Begin."}
      </button>
    </div>
  );
};

const ActionPhase = ({
  step,
  todayWisdom,
  timerSeconds,
  timerRunning,
  timerDone,
  inputValues,
  setInputValues,
  audioEnabled,
  speech,
  canAdvance,
  onComplete,
  onToggleTimer,
}) => {
  const setInput = (key, val) => setInputValues((prev) => ({ ...prev, [key]: val }));

  // Timer step
  if (step.type === "timer") {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.1rem",
            fontStyle: "italic",
            color: "var(--text-secondary)",
            marginBottom: "36px",
            lineHeight: 1.7,
          }}
        >
          {step.key === "silence"
            ? "Sit. Breathe. Do absolutely nothing. If thoughts come, let them pass like clouds."
            : "Move with presence and gratitude. Your body is celebrating its own aliveness."}
        </div>

        <TimerCircle seconds={timerSeconds} total={step.duration} color={step.color} />

        <div style={{ marginTop: "32px", marginBottom: "32px" }}>
          {!timerDone ? (
            <button
              onClick={onToggleTimer}
              style={{
                background: "transparent",
                border: `1px solid ${timerRunning ? "var(--border)" : step.color}`,
                color: timerRunning ? "var(--text-secondary)" : step.color,
                padding: "14px 36px",
                fontFamily: "Cinzel, serif",
                fontSize: "12px",
                letterSpacing: "0.12em",
                cursor: "pointer",
                borderRadius: "2px",
                transition: "all 0.3s",
                textTransform: "uppercase",
              }}
            >
              {timerRunning ? "Pause" : "Start Timer"}
            </button>
          ) : (
            <div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.3rem",
                  color: step.color,
                  fontStyle: "italic",
                  marginBottom: "8px",
                }}
              >
                Complete.
              </div>
              <div
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                }}
              >
                Well done
              </div>
            </div>
          )}
        </div>

        {/* Quote to sit with */}
        <div
          style={{
            padding: "20px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            textAlign: "left",
            marginBottom: "32px",
          }}
        >
          <p className="stoic-quote" style={{ fontSize: "1.1rem" }}>
            "{step.keyQuote}"
          </p>
          <p className="quote-author" style={{ marginTop: "10px" }}>
            — {step.keyQuoteAuthor}
          </p>
        </div>

        {canAdvance && (
          <button className="btn-primary" onClick={onComplete} style={{ display: "block", margin: "0 auto" }}>
            {step.actionLabel}
          </button>
        )}
      </div>
    );
  }

  // Reflection / battle step
  if (step.type === "reflection") {
    return (
      <div>
        <div
          style={{
            padding: "20px",
            background: "var(--bg-card)",
            border: `1px solid ${step.color}25`,
            borderRadius: "4px",
            marginBottom: "24px",
          }}
        >
          <p className="stoic-quote" style={{ fontSize: "1.1rem" }}>
            "{step.keyQuote}"
          </p>
          <p className="quote-author" style={{ marginTop: "10px" }}>
            — {step.keyQuoteAuthor}
          </p>
        </div>

        <label
          style={{
            display: "block",
            fontFamily: "Cinzel, serif",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "var(--gold-dim)",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {step.prompt}
        </label>
        <textarea
          className="stoic-input"
          rows={5}
          value={inputValues.prompt || ""}
          onChange={(e) => setInput("prompt", e.target.value)}
          placeholder="Write freely. No one is watching. This is just for you."
        />
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "0.9rem",
            fontStyle: "italic",
            color: "var(--text-muted)",
            marginTop: "10px",
            marginBottom: "28px",
          }}
        >
          * This step has no wrong answer. The act of writing is the practice.
        </p>
        <button className="btn-primary" onClick={onComplete} style={{ display: "block", margin: "0 auto" }}>
          {step.actionLabel}
        </button>
      </div>
    );
  }

  // Wisdom step
  if (step.type === "wisdom") {
    return (
      <div>
        <div
          style={{
            padding: "28px",
            background: "var(--bg-card)",
            border: `1px solid ${step.color}30`,
            borderLeft: `3px solid ${step.color}`,
            borderRadius: "4px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: "var(--gold-dim)",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Today's Passage
          </div>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.35rem",
              fontStyle: "italic",
              color: "var(--gold-light)",
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            "{todayWisdom.passage}"
          </p>
          <p className="quote-author">— {todayWisdom.author}</p>
        </div>

        {audioEnabled && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <AudioButton
              isPlaying={speech.isSpeaking}
              isPaused={speech.isPaused}
              onPlay={() =>
                speech.speak(
                  `Today's passage, from ${todayWisdom.author}. "${todayWisdom.passage}" ... Reflect on this: ${todayWisdom.reflection}`
                )
              }
              onPause={speech.pause}
              onResume={speech.resume}
            />
          </div>
        )}

        <div
          style={{
            padding: "20px",
            background: "rgba(138, 111, 160, 0.08)",
            border: "1px solid rgba(138, 111, 160, 0.2)",
            borderRadius: "4px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: "rgba(138, 111, 160, 0.8)",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Reflect
          </div>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              fontStyle: "italic",
              lineHeight: 1.7,
            }}
          >
            {todayWisdom.reflection}
          </p>
        </div>

        <button className="btn-primary" onClick={onComplete} style={{ display: "block", margin: "0 auto" }}>
          {step.actionLabel}
        </button>
      </div>
    );
  }

  // Intention step
  if (step.type === "intention") {
    return (
      <div>
        <div
          style={{
            padding: "20px",
            background: "var(--bg-card)",
            border: `1px solid ${step.color}25`,
            borderRadius: "4px",
            marginBottom: "24px",
          }}
        >
          <p className="stoic-quote" style={{ fontSize: "1.1rem" }}>
            "{step.keyQuote}"
          </p>
          <p className="quote-author" style={{ marginTop: "10px" }}>
            — {step.keyQuoteAuthor}
          </p>
        </div>

        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: "24px",
            fontStyle: "italic",
          }}
        >
          Marcus didn't say "today I will win." He said "today I will be worthy of whatever comes." The focus is always on who you are — not what happens.
        </div>

        <label
          style={{
            display: "block",
            fontFamily: "Cinzel, serif",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "var(--gold-dim)",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {step.prompt}
        </label>
        <textarea
          className="stoic-input"
          rows={4}
          value={inputValues.prompt || ""}
          onChange={(e) => setInput("prompt", e.target.value)}
          placeholder="Today I choose to be..."
        />
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "0.9rem",
            fontStyle: "italic",
            color: "var(--text-muted)",
            marginTop: "10px",
            marginBottom: "28px",
          }}
        >
          * Come back to this when the day gets hard.
        </p>
        <button className="btn-primary" onClick={onComplete} style={{ display: "block", margin: "0 auto" }}>
          {step.actionLabel}
        </button>
      </div>
    );
  }

  // Gratitude step
  if (step.type === "gratitude") {
    return (
      <div>
        <div
          style={{
            padding: "20px",
            background: "var(--bg-card)",
            border: `1px solid ${step.color}25`,
            borderRadius: "4px",
            marginBottom: "24px",
          }}
        >
          <p className="stoic-quote" style={{ fontSize: "1.1rem" }}>
            "{step.keyQuote}"
          </p>
          <p className="quote-author" style={{ marginTop: "10px" }}>
            — {step.keyQuoteAuthor}
          </p>
        </div>

        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: "24px",
            fontStyle: "italic",
          }}
        >
          Be specific. Not "I'm grateful for my family" — but why, and what exact moment. Specificity makes gratitude real.
        </div>

        {step.prompts.map((prompt, i) => (
          <div key={i} style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "Cinzel, serif",
                fontSize: "9px",
                letterSpacing: "0.15em",
                color: "var(--gold-dim)",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              {i + 1}. {prompt}
            </label>
            <textarea
              className="stoic-input"
              rows={3}
              value={inputValues[`g${i}`] || ""}
              onChange={(e) => setInput(`g${i}`, e.target.value)}
              placeholder="Be specific..."
            />
          </div>
        ))}

        <div style={{ marginTop: "8px", marginBottom: "28px" }}>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "0.95rem",
              fontStyle: "italic",
              color: "var(--text-muted)",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Place your hand on your heart. Take three breaths. Feel it.
          </p>
        </div>

        <button className="btn-primary" onClick={onComplete} style={{ display: "block", margin: "0 auto" }}>
          {step.actionLabel}
        </button>
      </div>
    );
  }

  // Default / teaching only
  return (
    <div style={{ textAlign: "center" }}>
      <button className="btn-primary" onClick={onComplete} style={{ display: "block", margin: "0 auto" }}>
        {step.actionLabel}
      </button>
    </div>
  );
};

const InfoCard = ({ label, icon, color, content, style }) => (
  <div
    style={{
      padding: "18px",
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "4px",
      ...style,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "10px",
      }}
    >
      <span style={{ fontSize: "14px" }}>{icon}</span>
      <span
        style={{
          fontFamily: "Cinzel, serif",
          fontSize: "9px",
          letterSpacing: "0.15em",
          color: color || "var(--gold-dim)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
    <p
      style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "1.05rem",
        color: "var(--text-secondary)",
        lineHeight: 1.7,
      }}
    >
      {content}
    </p>
  </div>
);

export default StepScreen;
