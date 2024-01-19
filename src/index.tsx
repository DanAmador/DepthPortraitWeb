import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Scene from "./Scene.tsx";
import theme from "./theme";
import { store } from "./redux";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CineonToneMapping } from "three";
import { Canvas } from "@react-three/fiber";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Canvas shadows gl={{
          antialias: false,
          // toneMapping: CineonToneMapping,
          alpha: true
          
        }}
          style={{ width: '100%', height: '100%' }}
          onPointerDown={(e) => {
            // prevent text selection
            e.preventDefault();
          }}>
          <Scene />
          
        </Canvas>;

      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
);
