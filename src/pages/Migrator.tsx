import { useState } from "react";
import { Steps, Button, Upload, message, Card, Typography, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import UploadDropZone from "../components/UploadDropZone";
import AnalyzeVersionStep from "../components/AnalyzeVersionStep";

const { Step } = Steps;
const { Title, Paragraph } = Typography;

export default function Migrator() {
  const [current, setCurrent] = useState(0);
  const [uploading, setUploading] = useState(false);
  // projects/e83cc75d83734d0245895f4cbd6f8d39
  const steps = [
    {
      title: "Upload Project",
      content: <UploadDropZone onSuccess={() => setCurrent(current + 1)} />,
    },
    {
      title: "Analyze Version",
      content: (
        <AnalyzeVersionStep
          projectPath="projects/e83cc75d83734d0245895f4cbd6f8d39/rpp-ng-recon-admin"
          onComplete={(data) => console.log("Analysis complete:", data)}
        />
      ),
    },
    {
      title: "Scan for Warnings",
      content: (
        <Paragraph>Scanning files for outdated Angular patterns...</Paragraph>
      ),
    },
    {
      title: "Get AI Suggestions",
      content: (
        <Paragraph>Select a warning to request a fix from the AI.</Paragraph>
      ),
    },
    {
      title: "Apply Fixes",
      content: (
        <Paragraph>
          Preview the suggested fix and apply it to your codebase.
        </Paragraph>
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
            <Button size="large" onClick={() => setCurrent(current - 1)}>
              Back
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              type="primary"
              size="large"
              onClick={() => setCurrent(current + 1)}
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
