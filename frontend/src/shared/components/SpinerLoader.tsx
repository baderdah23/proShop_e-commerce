const SpinerLoader = ({ className }: { className?: string }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full aspect-square border-b-2 ${className}`}
      ></div>
    </div>
  );
};

export default SpinerLoader;
