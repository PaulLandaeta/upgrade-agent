import { useEffect, useState } from "react";
import { Typography, Spin, message, Card, List } from "antd";

const { Paragraph, Title } = Typography;

type Props = {
  projectPath: string;
  onComplete: (data: any) => void;
};

export default function AnalyzeVersionStep({ projectPath, onComplete }: Props) {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/project/info?path=${encodeURIComponent(
            projectPath
          )}`
        );

        if (!res.ok) throw new Error("Failed to analyze project");

        const data = await res.json();
        setInfo(data);
        setLoading(false);
        onComplete(data);
      } catch (err) {
        message.error("Error fetching project info");
      }
    };

    fetchInfo();
  }, [projectPath]);

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
          renderItem={([dep, ver]) => (
            <List.Item>
              <span className="font-medium">{dep}</span>: {ver}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
