import { InboxOutlined } from "@ant-design/icons";
import { Upload, message, Typography } from "antd";
import type { UploadProps } from "antd";
import type { RcFile } from "antd/lib/upload";
import { useState } from "react";
import { uploadProject } from "../services/projectService";
import { useProjectStore } from "../store/projectStore";

const { Dragger } = Upload;
const { Text } = Typography;

export default function UploadDropZone({ onSuccess }: { onSuccess?: () => void }) {
  const [loadingFiles, setLoadingFiles] = useState<{ [key: string]: number }>({});
  const setProjectPath = useProjectStore((state) => state.setProjectPath);

  const customRequest: UploadProps["customRequest"] = async ({
    file,
    onSuccess: onOk,
    onError,
  }) => {
    const f = file as RcFile;
    const name = f.name;

    setLoadingFiles((prev) => ({ ...prev, [name]: 0 }));

    try {
      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 10, 90);
        setLoadingFiles((prev) => ({ ...prev, [name]: progress }));
      }, 200);

      const res = await uploadProject(f);
      clearInterval(interval);

      setLoadingFiles((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });

      setProjectPath(res.projectPath);
      message.success(`${name} uploaded successfully`);
      onOk?.(res);
      onSuccess?.();
    } catch (err) {
      setLoadingFiles((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
      message.error(`${name} upload failed`);
      onError?.(err as ProgressEvent<EventTarget>);
    }
  };

  return (
    <div className="p-15">
      <Dragger
        customRequest={customRequest}
        multiple={false}
        showUploadList={false}
        name="project"
        className="!bg-[#F9FAFB] border-gray-300 rounded-lg  p-12"
      >
        <div className="flex flex-col items-center justify-center space-y-4 py-10 h-80">
           <InboxOutlined className="text-blue-500 text-6xl" />
          <p className="text-xl font-semibold text-gray-700 text-center">
            Drop your Angular ZIP here
          </p>
          <p className="text-gray-500 text-base text-center">
            or click to upload from your computer
          </p>
        </div>
      </Dragger>

      {Object.keys(loadingFiles).length > 0 && (
        <div className="mt-6 space-y-2">
          {Object.entries(loadingFiles).map(([file, percent]) => (
            <div key={file} className="flex items-center justify-between gap-4">
              <Text className="truncate w-1/2">{file}</Text>
              <div className="w-1/2 bg-gray-200 rounded">
                <div
                  className="h-2 rounded bg-blue-500 transition-all duration-200"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-20 text-center">
                {Math.round(percent)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
