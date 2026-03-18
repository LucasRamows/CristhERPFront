const SystemFooterComponent = () => {
  return (
    <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-40 select-none pointer-events-none">
      <div className="w-8 h-8 bg-zinc-200 rounded-lg flex items-center justify-center">
        <span className="font-bold text-zinc-400">C</span>
      </div>
      <span className="font-bold text-zinc-400 tracking-widest uppercase text-[10px]">
        CristhERP
      </span>
    </div>
  );
};

export default SystemFooterComponent