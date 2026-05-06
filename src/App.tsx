import { Chat } from "./components/Chat";
import { SmallWidget } from "./components/SmallWidget";
import { useToggleWindow } from "./hooks/useToggleWindow";
import "./App.css";
import { useAppInit } from "./hooks/useAppInit";
import { useAppStore } from "./store/useAppStore";

function App() {
  const toggleWindow = useToggleWindow();
  const isExpanded = useAppStore((s) => s.isExpanded);
  useAppInit();

  return (
    <>
      {isExpanded ? (
        <Chat toggleWindow={toggleWindow} />
      ) : (
        <SmallWidget onClick={toggleWindow} />
      )}
    </>
  );
}

export default App;
