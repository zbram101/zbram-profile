export const Menu = ({ onSectionChange, menuOpened, setMenuOpened }) => {
  return (
    <>
      <button
        onClick={() => setMenuOpened(!menuOpened)}
        className="fixed right-6 top-6 z-20 flex h-12 w-12 flex-col items-center justify-center rounded-full border border-white/10 bg-slate-950/75 p-3 shadow-lg shadow-slate-950/30 backdrop-blur md:right-10 md:top-10"
      >
        <div
          className={`h-0.5 w-full rounded-md bg-[#f4efe7] transition-all ${
            menuOpened ? "translate-y-1 rotate-45" : ""
          }`}
        />
        <div
          className={`my-1 h-0.5 w-full rounded-md bg-[#f4efe7] ${
            menuOpened ? "hidden" : ""
          }`}
        />
        <div
          className={`h-0.5 w-full rounded-md bg-[#f4efe7] transition-all ${
            menuOpened ? "-rotate-45" : ""
          }`}
        />
      </button>
      <div
        className={`fixed bottom-0 right-0 top-0 z-10 flex flex-col overflow-hidden border-l border-white/10 bg-slate-950/92 backdrop-blur transition-all ${
          menuOpened ? "w-80" : "w-0"
        }`}
      >
        <div className="flex flex-1 flex-col justify-center gap-5 p-8">
          <MenuButton label="Overview" onClick={() => onSectionChange(0)} />
          <MenuButton label="Capabilities" onClick={() => onSectionChange(1)} />
          <MenuButton label="Experience" onClick={() => onSectionChange(2)} />
          <MenuButton label="Impact" onClick={() => onSectionChange(3)} />
          <MenuButton label="Connect" onClick={() => onSectionChange(4)} />
          <MenuButton label="AI Briefing" onClick={() => onSectionChange(5)} />
        </div>
      </div>
    </>
  );
};

const MenuButton = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-left text-2xl font-semibold tracking-[0.12em] text-[#f4efe7] transition-colors hover:text-[#dfa07a]"
    >
      {label}
    </button>
  );
};
