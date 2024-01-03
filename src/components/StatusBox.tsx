import { useEffect } from "react";

export type LoadStatus = "loading" | "success" | "failure" | undefined;

interface Props {
  status: LoadStatus;
  setStatus: (st: LoadStatus) => void;
}

let statusTimeout: NodeJS.Timeout;

const StatusBox = ({ status, setStatus }: Props) => {
  useEffect(() => {
    if (!status || status === "loading") return;

    if (statusTimeout) clearTimeout(statusTimeout);

    statusTimeout = setTimeout(() => {
      setStatus(undefined);
    }, 4000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      {status && (
        <div className={`status ${status ? `status-${status}` : ""}`}>
          {status}
        </div>
      )}
    </>
  );
};

export default StatusBox;
