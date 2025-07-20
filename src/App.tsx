import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Results from "./pages/Results";
import Projects from "./pages/ProjectsUpgraded";
import Migrator from "./pages/Migrator";
import AuditedProjects from "./pages/AuditedProjects";
import AuditStepper from "./pages/AuditStepper";
import FrameworkMigrationPage from "./pages/FrameworkMigration";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/projects" element={<Projects />} />
        <Route path='/audited-projects' element={<AuditedProjects />} />
        <Route path='/audited-new-projects' element={<AuditStepper />} />
        <Route path="/upload" element={<Migrator />} />
        <Route path="/results" element={<Results />} />
        <Route path="/framework-migration" element={<FrameworkMigrationPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
