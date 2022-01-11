import "./App.css";
import Dash from "./components/Dash";
import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyCqlSD6wS8yyE4Ai56yNYd079LUWiCuOIc",
  authDomain: "track-portfolio.firebaseapp.com",
  projectId: "track-portfolio",
});
const functions = getFunctions(app);
//remove below on PROD
connectFunctionsEmulator(functions, "localhost", 5001);

function App() {
  return <Dash functions={functions} />;
}

export default App;
