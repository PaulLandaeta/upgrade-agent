import { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Tooltip,
  Space,
  Spin,
  message,
  Button,
  Modal,
  Tabs,
  Input,
} from "antd";
import {
  FileTextOutlined,
  BulbOutlined,
  CheckOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getAISuggestion } from "../services/aiService";
import { fetchFileCode, applySuggestion } from "../services/projectService";

const { Title, Text, Paragraph } = Typography;

interface WarningItem {
  key: string;
  fileName: string;
  filePath: string;
  description: string;
}

export default function ScanAndFixStep({
  projectPath,
}: {
  projectPath: string;
}) {
  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState<WarningItem[]>([]);
  const [selectedWarning, setSelectedWarning] = useState<WarningItem | null>(
    null
  );
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [applying, setApplying] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

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
      } catch {
        message.error("Failed to fetch warnings");
      } finally {
        setLoading(false);
      }
    };

    fetchWarnings();
  }, [projectPath]);

  const parseWarnings = (warnings: WarningItem[]) =>
    warnings.map((w, i) => {
      const segments = w.filePath.split("/");
      return {
        key: i.toString(),
        fileName: segments.at(-1) || "",
        filePath: w.filePath,
        description: w.description,
      };
    });

  const requestFix = async (warning: WarningItem) => {
    setSelectedWarning(warning);
    setLoadingAI(true);
    try {
      const code = await fetchFileCode(
        projectPath + warning.filePath,
        warning.fileName
      );
      const res = await getAISuggestion({
        fileName: warning.fileName,
        warning: warning.description,
        code,
      });
      setSuggestion(res.codeUpdated || "No suggestion provided.");
      setExplanation(res.explanation || "");
      setCustomPrompt(res.suggestedPrompt || "");
      setModalOpen(true);
    } catch {
      message.error("Failed to get suggestion from AI");
    } finally {
      setLoadingAI(false);
    }
  };

  const applyFix = async () => {
    if (!selectedWarning || !suggestion) return;
    setApplying(true);
    try {
      await applySuggestion(
        `${projectPath}/${selectedWarning.fileName}`,
        suggestion
      );
      message.success("Suggestion applied successfully");
      setModalOpen(false);
    } catch {
      message.error("Failed to apply suggestion");
    } finally {
      setApplying(false);
    }
  };

  const requestRefinedSuggestion = async () => {
    if (!selectedWarning || !suggestion) return;
    setLoadingPrompt(true);
    try {
      const code = await fetchFileCode(projectPath, selectedWarning.fileName);
      const refined = await getAISuggestion({
        fileName: selectedWarning.fileName,
        warning: selectedWarning.description,
        code,
        prompt: customPrompt,
      });
      setSuggestion(refined.codeUpdated || "No suggestion returned");
    } catch {
      message.error("Failed to refine suggestion");
    } finally {
      setLoadingPrompt(false);
    }
  };

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
      title: "Fix",
      key: "fix",
      render: (_: any, record: WarningItem) => (
        <Tooltip title="Get AI Suggestion and Apply">
          <Button
            icon={<BulbOutlined />}
            onClick={() => requestFix(record)}
            loading={loadingAI && selectedWarning?.key === record.key}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <Title level={4}>Warnings & AI Fix</Title>
      {loading ? (
        <Spin tip="Scanning for deprecated patterns..." />
      ) : (
        <Table
          columns={columns}
          dataSource={warnings}
          pagination={{ pageSize: 5 }}
          bordered
        />
      )}

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title="AI Suggestion"
        width={800}
      >
        <Paragraph>
          <Text strong>File:</Text> {selectedWarning?.fileName}
        </Paragraph>
        <Paragraph>
          <Text strong>Warning:</Text> {selectedWarning?.description}
        </Paragraph>

        <Tabs defaultActiveKey="code" type="line">
          <Tabs.TabPane tab="Suggested Code" key="code">
            <Paragraph>
              <Text strong>Explanation:</Text> {explanation}
            </Paragraph>
            <div className="relative bg-gray-100 rounded max-h-[400px] overflow-auto pr-12">
              <CopyToClipboard
                text={suggestion || ""}
                onCopy={() => setCopied(true)}
              >
                <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                  <Button
                    icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                    size="small"
                    className="absolute top-2 left-180 z-10"
                  />
                </Tooltip>
              </CopyToClipboard>
              <pre className="p-4 whitespace-pre-wrap">{suggestion}</pre>
            </div>
            <Button
              type="primary"
              onClick={applyFix}
              className="mt-4"
              loading={applying}
            >
              Apply Suggestion
            </Button>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Refine Suggestion" key="prompt">
            <Input.TextArea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={4}
              placeholder="e.g. Use interceptors, simplify imports..."
            />
            <Button
              className="mt-2"
              type="primary"
              loading={loadingPrompt}
              onClick={requestRefinedSuggestion}
            >
              Request Improved Fix
            </Button>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}
