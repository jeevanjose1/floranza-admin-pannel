export default 
function GenericError({ error }: { error: unknown }) {
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-lg  p-8 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{details}</p>
          
          {stack && (
            <details className="text-left mb-6">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                Show technical details
              </summary>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs text-gray-700">
                <code>{stack}</code>
              </pre>
            </details>
          )}
          
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-medium border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}