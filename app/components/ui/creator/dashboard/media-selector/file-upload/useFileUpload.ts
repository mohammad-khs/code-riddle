import { useCallback, useState } from "react";
import { isFileTypeAllowed, formatAcceptForHumans } from "./utils";

interface UseFileUploadProps {
  accept: string;
  maxSizeMB?: number;
  onChange: (file: File | null) => void;
}

export const useFileUpload = ({
  accept,
  maxSizeMB = 10,
  onChange,
}: UseFileUploadProps) => {
  const [error, setError] = useState<string | null>(null);

  const validateAndSetFile = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange(null);
        setError(null);
        return;
      }

      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`Maximum file size is ${maxSizeMB}MB`);
        return;
      }

      if (!isFileTypeAllowed(file, accept)) {
        setError(
          `Invalid file type. Allowed: ${formatAcceptForHumans(accept)}`
        );
        return;
      }

      setError(null);
      onChange(file);
    },
    [accept, maxSizeMB, onChange]
  );

  const reset = useCallback(() => {
    onChange(null);
    setError(null);
  }, [onChange]);

  return { error, validateAndSetFile, reset };
};
