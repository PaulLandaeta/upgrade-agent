import { useState } from "react";
import {
  Table,
  Typography,
  Button,
  Modal,
  message,
  Tooltip,
  Space,
  Input,
  Card,
} from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { createProject } from "../services/projectService";
import type { MigrationFile } from "../services/aiService";
const { Title, Paragraph, Text } = Typography;

interface Props {
  fileList: MigrationFile[]; // Files to be included in the new project
}

export default function CreateProjectStep({ fileList }: Props) {
  const [selected, setSelected] = useState<MigrationFile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState<string>("");
  const [creating, setCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      message.error("Please enter a project name");
      return;
    }

    setCreating(true);
    try {
      const result = await createProject(fileList, projectName);
      message.success(result.message || "Project created successfully!");
    } catch (error) {
      message.error("Failed to create project");
      console.error("Create project error:", error);
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "File Type",
      dataIndex: "fileType",
      key: "fileType",
    },
    {
      title: "File Path",
      dataIndex: "filePath",
      key: "filePath",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: MigrationFile) => (
        <Space>
          <Tooltip title="View File Content">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelected(record);
                setModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="mt-4 space-y-4">
      <Card>
        <Title level={4}>Create New Project</Title>
        <Space direction="vertical" className="w-full">
          <div>
            <Text strong>Project Name:</Text>
            <Input
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            loading={creating}
            onClick={handleCreateProject}
            disabled={!projectName.trim() || fileList.length === 0}
          >
            Create Project
          </Button>
        </Space>
      </Card>

      <Card>
        <Title level={5}>Files to be included ({fileList.length})</Title>
        <Table
          columns={columns}
          dataSource={fileList}
          rowKey="filePath"
          pagination={false}
          bordered
        />
      </Card>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title="File Content Preview"
        width={900}
      >
        <Paragraph>
          <Text strong>File:</Text> {selected?.fileName}
        </Paragraph>
        <Paragraph>
          <Text strong>File Type:</Text> {selected?.fileType}
        </Paragraph>
        <Paragraph>
          <Text strong>File Path:</Text> {selected?.filePath}
        </Paragraph>
        <Paragraph>
          <Text strong>Content:</Text>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {selected?.content}
          </pre>
        </Paragraph>
      </Modal>
    </div>
  );
}
