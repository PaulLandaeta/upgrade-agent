import { useEffect, useState } from "react";
import { Typography, Spin, message, Card, List, Alert, Tabs, Collapse } from "antd";

import { getProjectInfo, type ProjectInfo } from "../services/projectService";

import { getAiMigrationFrameworkSuggestion, type AiMigrationFrameworkSuggestionResponse } from "../services/aiService";

const { Paragraph, Title } = Typography;

type Props = {
  projectPath: string;
  projectSource?: { type: 'upload' | 'git', gitUrl?: string } | null;
  onComplete: (data: ProjectInfo, aiSuggestion?: AiMigrationFrameworkSuggestionResponse) => void;
};

export default function StructurePreviewStep({ projectPath, projectSource, onComplete }: Props) {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<ProjectInfo | null>(null);
  const [aiSuggestionLoading, setAiSuggestionLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiMigrationFrameworkSuggestionResponse | null>(null);

  const fetchAiSuggestion = async (data: ProjectInfo) => {
    try {
      const suggestion = await getAiMigrationFrameworkSuggestion({
        projectPath: projectPath,
        projectSource: projectSource
      });
      
      setAiSuggestion(suggestion);
      onComplete(data, suggestion);
    } catch (error: any) {
      console.error('AI migration suggestion error:', error);
      
      // Handle different types of errors
      if (error?.code === 'ECONNABORTED') {
        message.error("AI analysis took longer than 60 seconds. Please try again or check your connection.");
      } else if (error?.response?.status === 500) {
        message.error("Server error during AI analysis. Please try again later.");
      } else if (error?.response?.status === 404) {
        message.error("AI migration service not available. Please contact support.");
      } else {
        message.error("Error fetching AI migration suggestions. Please try again.");
      }
      
      onComplete(data, undefined);
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        let data: ProjectInfo;
        
        // Skip getProjectInfo for Git projects
        if (projectSource?.type === 'git') {
          // For Git projects, create a minimal ProjectInfo or skip it entirely
          data = { version: 'Unknown', dependencies: {} };
          setInfo(data);
          
          // Log project source for debugging
          console.log("Project source:", projectSource);
          
          // Go directly to AI suggestion for Git projects
          setAiSuggestionLoading(true);
          await fetchAiSuggestion(data);
        } else {
          // For uploaded projects, get project info first
          data = await getProjectInfo(projectPath);
          setInfo(data);
          
          // Log project source for debugging
          console.log("Project source:", projectSource);
          
          // Fetch AI suggestion after getting project info
          setAiSuggestionLoading(true);
          await fetchAiSuggestion(data);
        }
      } catch {
        message.error("Error fetching project info");
        onComplete(null as any, undefined);
      } finally {
        setLoading(false);
        setAiSuggestionLoading(false);
      }
    };

    fetchInfo();
  }, [onComplete, projectPath, projectSource]);

  if (loading || aiSuggestionLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Spin size="large" />
        <Paragraph className="text-gray-600">
          {loading 
            ? (projectSource?.type === 'git' 
                ? "Preparing Git repository analysis..." 
                : "Detecting Angular version and dependencies..."
              )
            : "Getting AI migration suggestions... This may take up to 60 seconds."
          }
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
    <div className="mt-4 space-y-4">
      <Card>
        <Title level={5}>
          {projectSource?.type === 'git' ? 'Git Repository' : 'Detected Angular Version'}
        </Title>
        <Paragraph>
          {projectSource?.type === 'git' 
            ? projectSource.gitUrl || projectPath
            : info.version
          }
        </Paragraph>

        {projectSource?.type !== 'git' && Object.keys(info.dependencies).length > 0 && (
          <>
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
          </>
        )}
      </Card>

      {aiSuggestion && (
        <Card>
          <Title level={5}>AI Migration Analysis</Title>
          {aiSuggestion.migrationNotes && (
            <Alert
              message="Migration Notes"
              description={aiSuggestion.migrationNotes}
              type="info"
              showIcon
              className="mb-4"
            />
          )}
          
          <Tabs
            defaultActiveKey="structure"
            items={[
              {
                key: 'structure',
                label: 'Project Structure',
                children: (
                  <pre className="whitespace-pre-wrap bg-blue-50 p-4 rounded border overflow-auto max-h-96">
                    {aiSuggestion.projectStructure}
                  </pre>
                )
              },
              {
                key: 'files',
                label: 'Files List',
                children: (
                  <Collapse
                    items={[
                      {
                        key: 'filesList',
                        label: `Files (${aiSuggestion.fileList?.length || 0})`,
                        children: (
                          <div className="max-h-96 overflow-auto">
                            <List
                              size="small"
                              bordered
                              dataSource={aiSuggestion.fileList || []}
                              renderItem={(file) => (
                                <List.Item>
                                  <div className="w-full">
                                    <div className="font-medium text-blue-600 mb-2">
                                      {file.fileName} ({file.fileType})
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                      Path: {file.filePath}
                                    </div>
                                    <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded text-xs border">
                                      {file.content}
                                    </pre>
                                  </div>
                                </List.Item>
                              )}
                            />
                          </div>
                        )
                      }
                    ]}
                  />
                )
              },
              ...(aiSuggestion.dependencies ? [{
                key: 'dependencies',
                label: 'Dependencies',
                children: (
                  <List
                    size="small"
                    bordered
                    dataSource={aiSuggestion.dependencies}
                    renderItem={(dep) => (
                      <List.Item>{dep}</List.Item>
                    )}
                  />
                )
              }] : [])
            ]}
          />
        </Card>
      )}
    </div>
  );
}
