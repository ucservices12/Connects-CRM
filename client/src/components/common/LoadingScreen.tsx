const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default LoadingScreen;