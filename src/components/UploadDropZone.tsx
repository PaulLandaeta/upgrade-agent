import { InboxOutlined } from "@ant-design/icons";
import { Upload, message, Typography } from "antd";
import type { UploadProps } from "antd";
import { RcFile } from "antd/lib/upload";
import { useState } from "react";

const { Dragger } = Upload;
const { Text } = Typography;

export default function UploadDropZone({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [loadingFiles, setLoadingFiles] = useState<{ [key: string]: number }>(
    {}
  );

  const props: UploadProps = {
    name: "project",
    multiple: false,
    action: "http://localhost:4000/api/project/upload",
    onChange(info) {
      const { status, name, percent } = info.file;

      if (status === "uploading") {
        setLoadingFiles((prev) => ({ ...prev, [name]: percent || 0 }));
      }

      if (status === "done") {
        message.success(`${name} uploaded successfully`);
        setLoadingFiles((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
        onSuccess?.();
      } else if (status === "error") {
        message.error(`${name} upload failed`);
      }
    },
    showUploadList: false,
  };

  return (
    <div className=" p-15">
      <Dragger {...props} className="py-10">
        <p className="text-3xl text-blue-500 text-center mb-4">
          <InboxOutlined />
        </p>
        <p className="text-lg text-gray-700 font-semibold mt-2">
          Drag & drop your Angular ZIP file
        </p>
        <p className="text-gray-500 text-sm">or click to browse</p>
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
              <span className="text-xs text-gray-600 w-12 text-right">
                {Math.round(percent)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
