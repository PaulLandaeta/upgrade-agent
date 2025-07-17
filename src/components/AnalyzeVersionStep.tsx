import { useEffect, useState } from "react";
import { Typography, Spin, message, Card, List } from "antd";

import { getProjectInfo, type ProjectInfo } from "../services/projectService";

const { Paragraph, Title } = Typography;

type Props = {
  projectPath: string;
  onComplete: (data: ProjectInfo) => void;
};

export default function AnalyzeVersionStep({ projectPath, onComplete }: Props) {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<ProjectInfo | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getProjectInfo(projectPath);
        setInfo(data);
        onComplete(data);
      } catch {
        message.error("Error fetching project info");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [onComplete, projectPath]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Spin size="large" />
        <Paragraph className="text-gray-600">
          Detecting Angular version and dependencies...
        </Paragraph>
      </div>
    );
  }

  if (!info) {
    return (
      <Paragraph className="text-red-500 text-center">
        Could not load project info.
      </Paragraph>
    );
  }

  return (
    <div className="mt-4">
      <Card>
        <Title level={5}>Detected Angular Version</Title>
        <Paragraph>{info.version}</Paragraph>

        <Title level={5}>Main Dependencies</Title>
        <List
          size="small"
          bordered
          dataSource={Object.entries(info.dependencies).slice(0, 10)}
          renderItem={([dependency, version]) => (
            <List.Item>
              <span className="font-medium">{dependency}</span>: {version}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
