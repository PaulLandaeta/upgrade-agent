import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Results from "./pages/Results";
import Projects from "./pages/ProjectsUpgraded";
import Migrator from "./pages/Migrator";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/projects" element={<Projects />} />
        <Route path="/upload" element={<Migrator />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Layout>
  );
}

export default App;
