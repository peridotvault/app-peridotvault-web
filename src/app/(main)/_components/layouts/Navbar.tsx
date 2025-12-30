import { ConnectPeridotButton } from "@/shared/temp/ConnectPeridotButton";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-card px-8 py-6 ">
      <div className="mx-auto max-w-[1400px] flex items-center justify-between w-full">
        <div className="">
          <nav className="flex">
            <ol>
              <li>
                <Link href={"/"} className="flex items-center text-3xl gap-3">
                  <Image
                    width={120}
                    height={120}
                    src="/brand/logo-peridot.png"
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                  <span>
                    <span className="font-bold">Peridot</span>Vault
                  </span>
                </Link>
              </li>
            </ol>
          </nav>
        </div>
        <ConnectPeridotButton />
      </div>
    </header>
  );
}
