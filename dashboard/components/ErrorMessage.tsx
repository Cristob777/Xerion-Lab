interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export default function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <div className="bg-danger-50 border border-danger-200 rounded-lg p-6 my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-danger-600 text-2xl mr-3">⚠️</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-danger-900 mb-1">Error</h3>
          <p className="text-danger-700">{message}</p>
          {retry && (
            <button
              onClick={retry}
              className="mt-3 px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
