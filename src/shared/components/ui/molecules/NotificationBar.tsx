import Link from "next/link";

export const NotificationBar = () => {
  return (
    <div className="flex gap-1 items-center justify-center w-full bg-highlight p-2 text-background z-21 font-medium">
      <span>It{"'"}s just a Testnet</span>
      <Link href={"https://peridotvault.com/"} className="font-bold underline">
        Join our Waitlist
      </Link>
      <span>Now!</span>
    </div>
  );
};
