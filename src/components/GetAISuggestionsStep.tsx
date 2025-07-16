import { useState } from "react";
import {
  Table,
  Typography,
  Button,
  Modal,
  message,
  Tooltip,
  Tabs,
  Input,
} from "antd";
import { BulbOutlined, CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

const { Title, Paragraph, Text } = Typography;

interface Props {
  warnings: { key: string; fileName: string; description: string }[];
  path: string;
}

interface AiSuggestionRequest {
  fileName: string;
  code: string;
  warning: string;
}

interface AiSuggestionResponse {
  codeUpdated: string;
  explanation?: string;
  suggestedPrompt?: string;
}

async function getAISuggestion(
  data: AiSuggestionRequest
): Promise<AiSuggestionResponse> {
  const res = await fetch("http://localhost:4000/api/ai/suggest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to get AI suggestion");
  }

  return res.json();
}

export default function GetAISuggestionsStep({ warnings, path }: Props) {
  const [selectedWarning, setSelectedWarning] = useState<{
    fileName: string;
    description: string;
  } | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);

  async function fetchFileCode(
    path: string,
    fileName: string
  ): Promise<string> {
    const res = await fetch(
      `http://localhost:4000/api/project/file?path=${encodeURIComponent(
        path
      )}&file=${encodeURIComponent(fileName)}`
    );
    if (!res.ok) throw new Error("Failed to load file content");
    const json = await res.json();
    return json.code;
  }

  const requestFix = async (fileName: string, warning: string) => {
    setLoading(true);
    try {
      console.log("Requesting AI suggestion for:", fileName, warning);
      const code = await fetchFileCode(path, fileName);
      const response = await getAISuggestion({ fileName, code, warning });
      setSuggestion(response.codeUpdated || "No suggestion provided.");
      setExplanation(response.explanation || null);
      setCustomPrompt(response.suggestedPrompt || "");
      setModalOpen(true);
    } catch (err) {
      message.error("Failed to get suggestion from AI");
    } finally {
      setLoading(false);
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
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Tooltip title="Get AI Suggestion">
          <Button
            icon={<BulbOutlined />}
            onClick={() => {
              setSelectedWarning(record);
              requestFix(record.fileName, record.description);
            }}
            loading={loading && selectedWarning === record.description}
          />
        </Tooltip>
      ),
    },
  ];

  const requestRefinedSuggestion = async () => {
    if (!selectedWarning) return;

    setLoadingPrompt(true);
    try {
      const res = await fetch("http://localhost:4000/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedWarning.fileName,
          warning: selectedWarning.description,
          code: selectedWarning.originalCode || "",
          prompt: customPrompt,
        }),
      });
      const json = await res.json();
      setSuggestion(json.codeUpdated || "No suggestion returned");
    } catch (err) {
      message.error("Failed to refine suggestion");
    } finally {
      setLoadingPrompt(false);
    }
  };
  return (
    <div className="mt-4">
      <Title level={4}>Select a warning to request a fix from the AI</Title>
      <Table
        columns={columns}
        dataSource={warnings}
        pagination={{ pageSize: 8 }}
        rowKey="key"
        bordered
      />

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
              <CopyToClipboard text={suggestion} onCopy={() => setCopied(true)}>
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
          </Tabs.TabPane>

          <Tabs.TabPane tab="Refine Suggestion" key="prompt">
            <Paragraph>
              <Text strong>Refine Prompt:</Text>
            </Paragraph>
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
