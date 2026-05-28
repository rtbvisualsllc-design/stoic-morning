import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import StepScreen from "./components/StepScreen";
import ClosingScreen from "./components/ClosingScreen";
import HistoryScreen from "./components/HistoryScreen";
import { useAppState } from "./hooks/useAppState";
import { steps } from "./data/steps";
import "./App.css";

const SCREENS = {
  HOME: "home",
  STEP: "step",
  CLOSING: "closing",
  HISTORY: "history",
};

function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sessionData, setSessionData] = useState({
    battleReflection: "",
    intention: "",
    gratitude1: "",
    gratitude2: "",
    gratitude3: "",
  });
  const [finalStreak, setFinalStreak] = useState(0);

  const appState = useAppState();

  const handleBegin = () => {
    setCurrentStepIndex(0);
    setSessionData({ battleReflection: "", intention: "", gratitude1: "", gratitude2: "", gratitude3: "" });
    setScreen(SCREENS.STEP);
  };

  const handleStepComplete = (data) => {
    // Merge any data from this step
    const updated = { ...sessionData, ...data };
    setSessionData(updated);

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // All steps complete
      const newStreak = appState.saveCompletion(updated);
      setFinalStreak(newStreak);
      setScreen(SCREENS.CLOSING);
    }
  };

  const handleGoHome = () => {
    setScreen(SCREENS.HOME);
    setCurrentStepIndex(0);
  };

  const handleViewHistory = () => {
    setScreen(SCREENS.HISTORY);
  };

  return (
    <div className="app">
      {screen === SCREENS.HOME && (
        <HomeScreen
          streak={appState.streak}
          totalCompletions={appState.totalCompletions}
          todayCompleted={appState.todayCompleted}
          audioEnabled={appState.audioEnabled}
          onAudioToggle={appState.setAudioEnabled}
          onBegin={handleBegin}
          onViewHistory={handleViewHistory}
        />
      )}
      {screen === SCREENS.STEP && (
        <StepScreen
          step={steps[currentStepIndex]}
          stepIndex={currentStepIndex}
          totalSteps={steps.length}
          audioEnabled={appState.audioEnabled}
          onComplete={handleStepComplete}
          onHome={handleGoHome}
        />
      )}
      {screen === SCREENS.CLOSING && (
        <ClosingScreen
          streak={finalStreak}
          sessionData={sessionData}
          onHome={handleGoHome}
        />
      )}
      {screen === SCREENS.HISTORY && (
        <HistoryScreen
          history={appState.history}
          streak={appState.streak}
          totalCompletions={appState.totalCompletions}
          onBack={handleGoHome}
        />
      )}
    </div>
  );
}

export default App;
