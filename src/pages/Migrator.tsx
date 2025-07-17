import { useState } from "react";
import { Steps, Button, Card, Typography } from "antd";
import UploadDropZone from "../components/UploadDropZone";
import AnalyzeVersionStep from "../components/AnalyzeVersionStep";
import ScanWarningsStep from "../components/ScanWarningsStep";
import GetAISuggestionsStep from "../components/GetAISuggestionsStep";
import ApplyFixesStep from "../components/ApplyFixesStep";
import { useProjectStore } from "../store/projectStore";

const { Step } = Steps;
const { Title } = Typography;

export default function Migrator() {
  const [current, setCurrent] = useState(0);
  const [warnings, setWarnings] = useState<WarningItem[]>([]);
  const { projectPath } = useProjectStore();

  const next = () => setCurrent((prev) => prev + 1);
  const back = () => setCurrent((prev) => prev - 1);

  // projects/e83cc75d83734d0245895f4cbd6f8d39
  const steps = [
    {
      title: "Upload Project",
      content: <UploadDropZone onSuccess={next} />,
    },
    {
      title: "Analyze Version",
      content: (
        <AnalyzeVersionStep
          projectPath={projectPath}
          onComplete={(data) => console.log("Analysis complete:", data)}
        />
      ),
    },
    {
      title: "Scan for Warnings",
      content: (
        <ScanWarningsStep
          projectPath={projectPath}
          onComplete={next}
          onWarningsParsed={setWarnings}
        />
      ),
    },
    {
      title: "Get AI Suggestions",
      content: (
        <GetAISuggestionsStep
          warnings={warnings}
          path={projectPath}
        />
      ),
    },
    {
      title: "Apply Fixes",
      content: (
        <ApplyFixesStep
          path={projectPath}
          suggestions={[]}
        />
      ),
    },
  ];

  return (
    <div className="bg-gray-50 flex justify-center items-start p-5">
      <Card className="mx-auto mt-10 p-6 shadow-lg bg-white max-w-6xl w-full min-h-[75vh]">
        <Title level={3} className="mb-4">
          Angular Migration Assistant
        </Title>

        <Steps current={current} className="mb-6">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div className="min-h-[350px]">{steps[current].content}</div>

        <div className="flex justify-center mt-8 gap-4">
          {current > 0 && (
            <Button size="large" onClick={() => back()}>
              Back
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" size="large" onClick={() => next()}>
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
