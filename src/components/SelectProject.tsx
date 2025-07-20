import { useState } from "react";
import { Card, Typography, Tabs, Input, Button, Form, message, Space, Divider } from "antd";
import { GithubOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";
import UploadDropZone from "./UploadDropZone";

const { Title, Paragraph } = Typography;

type Props = {
  onSuccess: (projectSource: { type: 'upload' | 'git', gitUrl?: string }) => void;
};

export default function SelectProject({ onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState("git");
  const [gitUrl, setGitUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUploadSuccess = () => {
    onSuccess({ type: 'upload' });
  };

  const handleGitImport = async () => {
    if (!gitUrl.trim()) {
      message.error("Please enter a valid Git repository URL");
      return;
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+\.git$|^git@.+:.+\.git$|^https:\/\/github\.com\/.+\/.+$/;
    if (!urlPattern.test(gitUrl)) {
      message.error("Please enter a valid Git repository URL (e.g., https://github.com/user/repo)");
      return;
    }

    setLoading(true);
    try {
      message.success("Git repository imported successfully!");
      onSuccess({ type: 'git', gitUrl: gitUrl });
    } catch (error) {
      message.error("Failed to import Git repository. Please check the URL and try again.");
      console.error("Git import error:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "git",
      label: (
        <Space>
          <GithubOutlined />
          Import from Git
        </Space>
      ),
      children: (
        <div className="p-4">
          <div className="text-center mb-6">
            <GithubOutlined className="text-4xl text-green-500 mb-4" />
            <Title level={4}>Import from Git Repository</Title>
            <Paragraph className="text-gray-600">
              Enter the URL of your Git repository to analyze your Angular project
            </Paragraph>
          </div>
          
          <Form layout="vertical" onFinish={handleGitImport}>
            <Form.Item
              label="Git Repository URL"
              required
              help="Examples: https://github.com/user/repo, https://gitlab.com/user/repo.git"
            >
              <Input
                prefix={<LinkOutlined />}
                placeholder="https://github.com/username/angular-project"
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                size="large"
              />
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                disabled={!gitUrl.trim()}
              >
                {loading ? "Importing Repository..." : "Import Repository"}
              </Button>
            </Form.Item>
          </Form>
          
          <Divider />
          
        </div>
      )
    },
    {
      key: "upload",
      label: (
        <Space>
          <UploadOutlined />
          Upload Local Project
        </Space>
      ),
      children: (
        <div className="p-4">
          <div className="text-center mb-6">
            <UploadOutlined className="text-4xl text-blue-500 mb-4" />
            <Title level={4}>Upload Your Angular Project</Title>
            <Paragraph className="text-gray-600">
              Upload a ZIP file containing your Angular project to analyze and migrate
            </Paragraph>
          </div>
          <UploadDropZone onSuccess={handleUploadSuccess} />
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Title level={3}>Select Your Angular Project</Title>
        <Paragraph className="text-lg text-gray-600">
          Choose how you'd like to provide your Angular project for migration analysis
        </Paragraph>
      </div>

      <Card className="shadow-lg">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          centered
          size="large"
        />
      </Card>

      <div className="mt-6 text-center">
        <Paragraph className="text-sm text-gray-500">
          Your project data is processed securely and temporarily. We don't store your code permanently.
        </Paragraph>
      </div>
    </div>
  );
}
