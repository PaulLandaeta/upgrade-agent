import { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Button,
  Modal,
  Tabs,
  Tooltip,
  Spin,
  message,
} from "antd";
import { BulbOutlined, CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useProjectStore } from "../store/projectStore";
import {
  auditDependencies,
  getAuditSuggestion,
} from "../services/projectService";

const { Title, Text, Paragraph } = Typography;

interface AlertItem {
  key: string;
  module: string;
  vulnerable_versions: string;
  severity: string;
  recommendation: string;
  title: string;
}

export default function AuditAlertsStep() {
  const { projectPath } = useProjectStore();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await auditDependencies(projectPath);
        const formatted = res.alerts.map((a: any, idx: number) => ({
          ...a,
          key: idx.toString(),
        }));
        setAlerts(formatted);
      } catch {
        message.error("Failed to fetch audit alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [projectPath]);

  const requestAISuggestion = async (alert: AlertItem) => {
    setSelectedAlert(alert);
    setLoadingAI(true);
    try {
      const res = await getAuditSuggestion({
        module: alert.module,
        vulnerable_versions: alert.vulnerable_versions,
        recommendation: alert.recommendation,
        severity: alert.severity,
        title: alert?.title,
      });
      setSuggestion(res.fix);
      setExplanation(res.explanation);
      setModalOpen(true);
    } catch {
      message.error("Failed to get AI suggestion");
    } finally {
      setLoadingAI(false);
    }
  };

  const columns = [
    {
      title: "Package",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Vulnerable",
      dataIndex: "vulnerable_versions",
      key: "vulnerable_versions",
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
    },
    {
      title: "Recommendation",
      dataIndex: "recommendation",
      key: "recommendation",
    },
    {
      title: "AI Fix",
      key: "ai",
      render: (_: any, record: AlertItem) => (
        <Tooltip title="Get AI Suggestion">
          <Button
            icon={<BulbOutlined />}
            onClick={() => requestAISuggestion(record)}
            loading={loadingAI && selectedAlert?.key === record.key}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <Title level={4}>Dependency Audit Alerts</Title>
      {loading ? (
        <Spin tip="Running npm audit..." />
      ) : (
        <Table
          columns={columns}
          dataSource={alerts}
          pagination={{ pageSize: 5 }}
          bordered
        />
      )}

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title="AI Fix Suggestion"
        width={800}
      >
        <Paragraph>
          <Text strong>Package:</Text> {selectedAlert?.module}
        </Paragraph>
        <Paragraph>
          <Text strong>Recommendation:</Text> {selectedAlert?.recommendation}
        </Paragraph>

        <Tabs defaultActiveKey="code" type="line">
          <Tabs.TabPane tab="Suggested Fix" key="code">
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
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}
