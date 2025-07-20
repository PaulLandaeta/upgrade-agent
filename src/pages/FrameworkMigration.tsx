import { useState } from "react";
import { Steps, Button, Card, Typography } from "antd";
import { useProjectStore } from "../store/projectStore";
import StructurePreviewStep from "../components/StructurePreviewStep";
import CreateProjectStep from "../components/CreateProjectStep";
import type { MigrationFile } from "../services/aiService";
import SelectProject from "../components/SelectProject";

const { Step } = Steps;
const { Title } = Typography;

export default function FrameworkMigrationPage() {
  const [current, setCurrent] = useState(0);
  const { projectPath } = useProjectStore();
  const [files, setFiles] = useState<MigrationFile[]>([]);
  const [projectSource, setProjectSource] = useState<{ type: 'upload' | 'git', gitUrl?: string } | null>(null);

  const next = () => setCurrent((prev) => prev + 1);
  const back = () => setCurrent((prev) => prev - 1);

  const handleProjectSelect = (source: { type: 'upload' | 'git', path?: string, gitUrl?: string }) => {
    setProjectSource(source);
    next();
  };

  const handleAnalysisComplete = (data: any, aiSuggestion?: any) => {
    console.log("Analysis complete:", data);
    if (aiSuggestion && aiSuggestion.fileList) {
      setFiles(aiSuggestion.fileList);
    }
  };

  // Determine the project path to use for analysis
  const getProjectPath = () => {
    if (projectSource?.type === 'git' && projectSource.gitUrl) {
      return projectSource.gitUrl;
    }
    return projectPath; // From upload
  };

  const steps = [
    {
      title: "Select Angular Project",
      content: <SelectProject onSuccess={handleProjectSelect} />,
    },
    {
      title: "Project Architecture Preview",
      content: (
        <StructurePreviewStep
          projectPath={getProjectPath()}
          projectSource={projectSource}
          onComplete={handleAnalysisComplete}
        />
      ),
    },
    {
      title: "Create Project",
      content: <CreateProjectStep fileList={files} />,
    },
  ];

  return (
    <div className="bg-gray-50 flex justify-center items-start p-5">
      <Card className="mx-auto mt-10 p-6 shadow-lg bg-white max-w-6xl w-full min-h-[75vh]">
        <Title level={2} className="mb-6 text-center">
          Framework Migration Assistant
        </Title>

        <Steps current={current} className="mb-6 mt-6">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div className="min-h-[400px]">{steps[current].content}</div>

        <div className="flex justify-center mt-8 gap-4">
          {current > 0 && (
            <Button className="w-32" size="large" onClick={() => back()}>
              Back
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              className="w-32"
              type="primary"
              size="large"
              onClick={() => next()}
              disabled={!getProjectPath()}
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
