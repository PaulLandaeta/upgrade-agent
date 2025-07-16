import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Migrator from "./pages/Migrator";
import Results from "./pages/Results";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Migrator />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Layout>
  );
}

export default App;
