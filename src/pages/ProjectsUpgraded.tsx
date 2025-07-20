import { useEffect, useState } from "react";
import { Card, Typography, Spin, Tag, Button } from "antd";
import { useNavigate } from "react-router-dom";
import angularLogo from "../assets/angular.svg";
import { useProjectStore } from "../store/projectStore";
import { API_BASE_URL } from "../config";

const { Title, Paragraph } = Typography;

interface Project {
  id: string;
  originalFolder: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const setProjectPath = useProjectStore((state) => state.setProjectPath);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/project/list`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects", err))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (project: Project) => {
    setProjectPath(`projects/${project.id}`);
    navigate("/upload", {
      state: {
        projectPath: `/projects/${project.id}/${project.originalFolder}`,
      },
    });
  };

  if (loading) return <Spin className="mt-10" />;

  const handleNewProject = () => {
    setProjectPath("");
    navigate("/upload");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Projects</Title>
        <Button type="primary" onClick={handleNewProject}>
          + New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            hoverable
            onClick={() => handleClick(project)}
            className="cursor-pointer rounded-xl shadow-md border"
            cover={
              <img
                alt="Angular"
                src={angularLogo}
                className="w-20 h-20 object-contain mx-auto mt-4"
              />
            }
          >
            <div className="flex justify-between items-center mb-2">
              <Title level={5} className="mb-0">
                {project.originalFolder}
              </Title>
              <Tag color="volcano">Angular 8</Tag>
            </div>
            <Paragraph type="secondary">
              Project migrated with Angular. Click to continue the migration.
            </Paragraph>
          </Card>
        ))}
      </div>
    </div>
  );
}
