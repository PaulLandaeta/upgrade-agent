import { useEffect, useState } from "react";
import { Table, Typography, Tooltip, Space, Spin, message } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface WarningItem {
  key: string;
  fileName: string;
  description: string;
}

export default function ScanWarningStep({
  projectPath,
  onWarningsParsed,
}: {
  projectPath: string;
  onComplete: () => void;
  onWarningsParsed: (warnings: WarningItem[]) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState<WarningItem[]>([]);

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/project/warnings?path=${encodeURIComponent(
            projectPath
          )}&from=6&to=8`
        );
        const json = await res.json();
        const parsed = parseWarnings(json.warnings);
        setWarnings(parsed);
        onWarningsParsed(parsed);
      } catch (error) {
        message.error("Failed to fetch warnings");
      } finally {
        setLoading(false);
      }
    };

    fetchWarnings();
  }, [projectPath]);

  const columns = [
    {
      title: "File",
      dataIndex: "fileName",
      key: "fileName",
      render: (text: string) => (
        <Space>
          <FileTextOutlined />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Text type="secondary" ellipsis={{ tooltip: text }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space size="middle">
          <Tooltip title="View">
            <EyeOutlined className="text-blue-500 cursor-pointer" />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined className="text-red-500 cursor-pointer" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <Title level={4}>Detected Warnings</Title>
      {loading ? (
        <Spin tip="Scanning for deprecated patterns..." />
      ) : (
        <Table
          columns={columns}
          dataSource={warnings}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      )}
    </div>
  );
}

type Warning = {
  key: string;
  fileName: string;
  filePath: string;
  description: string;
};

// Helper
function parseWarnings(warnings: Warning[]): WarningItem[] {
  return warnings.map((w, i) => {
    const segments = w.filePath.split("/");
    const fileName = segments[segments.length - 1];
    return {
      key: i.toString(),
      fileName,
      filePath: w.filePath,
      description: w.description,
    };
  });
}
