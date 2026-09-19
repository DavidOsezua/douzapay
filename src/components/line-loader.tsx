function LineLoader() {
  return (
    <div className="relative h-1 w-full overflow-hidden bg-gray-200">
      <div className="from-primary-500 via-primary-500 to-primary-500 animate-loading-line absolute h-full w-[70%] bg-gradient-to-r"></div>
    </div>
  );
}

export default LineLoader;
