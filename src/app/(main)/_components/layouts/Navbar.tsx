import { ConnectPeridotButton } from "@/shared/temp/ConnectPeridotButton";

export default function Navbar() {
  return (
    <header className="w-full bg-card px-8 py-4 ">
      <div className="mx-auto max-w-[1400px] flex items-center justify-between w-full">
        <div className=""></div>
        <ConnectPeridotButton />
      </div>
    </header>
  );
}
