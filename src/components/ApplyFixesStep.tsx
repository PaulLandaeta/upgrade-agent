import { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Button,
  Modal,
  message,
  Tooltip,
  Space,
} from "antd";
import { CheckOutlined, EyeOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

interface Suggestion {
  key: string;
  fileName: string;
  originalCode: string;
  codeUpdated: string;
  warning: string;
}

interface Props {
  path: string;
  suggestions: Suggestion[]; // ← deberías pasar esto desde el paso anterior
}

export default function ApplyFixesStep({ path, suggestions }: Props) {
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const applyFix = async (fileName: string, codeUpdated: string) => {
    setLoadingKey(fileName);
    try {
      const filePath = `${path}/${fileName}`;
      const res = await fetch("http://localhost:4000/api/project/apply-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath, codeUpdated }),
      });

      const data = await res.json();

      if (res.ok) {
        message.success("Fix applied successfully");
      } else {
        message.error(data.error || "Failed to apply fix");
      }
    } catch (err) {
      message.error("Server error while applying fix");
    } finally {
      setLoadingKey(null);
    }
  };

  const columns = [
    {
      title: "File",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Warning",
      dataIndex: "warning",
      key: "warning",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Suggestion) => (
        <Space>
          <Tooltip title="View Suggestion">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelected(record);
                setModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Apply Fix">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={loadingKey === record.fileName}
              onClick={() => applyFix(record.fileName, record.codeUpdated)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <Title level={4}>Preview the suggested fix and apply it to your codebase.</Title>
      <Table
        columns={columns}
        dataSource={suggestions}
        rowKey="key"
        pagination={false}
        bordered
      />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title="Code Suggestion Preview"
        width={900}
      >
        <Paragraph>
          <Text strong>File:</Text> {selected?.fileName}
        </Paragraph>
        <Paragraph>
          <Text strong>Warning:</Text> {selected?.warning}
        </Paragraph>
        <Paragraph>
          <Text strong>Suggested Code:</Text>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {selected?.codeUpdated}
          </pre>
        </Paragraph>
      </Modal>
    </div>
  );
}
