const CardSkeleton = () => {
  return (
    <div className="h-[160px] w-70 max-w-lg animate-pulse overflow-hidden rounded-xl bg-white/10 shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]">
      <div className="bg-opacity-50 flex h-2/3 flex-col justify-between bg-white/10 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-6 rounded bg-white/10"></div>
          <div className="h-6 w-6 rounded bg-white/10"></div>
        </div>
        <div className="h-6 w-3/4 bg-white/10"></div>
      </div>
      <div className="h-1/3 bg-white/10">
        <div className="flex items-center justify-between px-4 pt-2">
          <div className="text-lg leading-6">
            <div className="mb-1 h-5 w-1/2 bg-white/10"></div>
            <div className="h-5 w-1/2 bg-white/10"></div>
          </div>
          <div className="h-6 w-6 rounded bg-white/10"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
