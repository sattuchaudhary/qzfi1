import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set title
document.title = "QZFI - Quiz Test Platform";

createRoot(document.getElementById("root")!).render(<App />);
