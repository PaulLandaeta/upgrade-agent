import { useState } from "react";
import { Steps, Button, Card, Typography } from "antd";
import UploadDropZone from "../components/UploadDropZone";
import { useProjectStore } from "../store/projectStore";
import AuditAlertsStep from "../components/DependencyAlertsStep";

const { Step } = Steps;
const { Title } = Typography;

export default function Migrator() {
  const [current, setCurrent] = useState(0);
  const { projectPath } = useProjectStore();

  const next = () => setCurrent((prev) => prev + 1);
  const back = () => setCurrent((prev) => prev - 1);

  const steps = [
    {
      title: "Upload Project",
      content: <UploadDropZone onSuccess={next} />,
    },
    {
      title: "Audit Project Version and Dependencies",
      content: (
        <AuditAlertsStep />
      ),
    }
  ];

  return (
    <div className="bg-gray-50 flex justify-center items-start p-5">
      <Card className="mx-auto mt-10 p-6 shadow-lg bg-white max-w-6xl w-full min-h-[75vh]">
        <Title level={3} className="mb-6 text-center">
          Audit Projects
        </Title>

        <Steps current={current} className="mb-6 mt-6">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div className="min-h-[400px]">{steps[current].content}</div>

        <div className="flex justify-center mt-5 gap-4">
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
              disabled={!projectPath}
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
