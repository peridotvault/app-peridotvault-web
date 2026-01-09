import { AnimatePresence, motion } from "framer-motion";
import { short } from "../utils/customAccountId";
import Link from "next/link";
import {
  faGear,
  faMicrophoneLines,
  faPowerOff,
  faPuzzlePiece,
  faShirt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  open: boolean;
  onClose: () => void;
  accountId: string;
};

export const ModalProfile = ({ open, onClose, accountId }: Props) => {
  return (
    <AnimatePresence /* initial={false} boleh ditambah kalau mau */>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-45"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="absolute right-0 top-12 z-50">
            <motion.div
              className=" bg-card rounded-2xl px-4 py-6 w-100 flex flex-col gap-4 items-center border border-foreground/10 shrink-0"
              role="dialog"
              aria-label="Required Password"
              initial={{ y: "-10%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-10%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 480,
                damping: 42,
                mass: 0.8,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <section
                aria-label="header-modal"
                className="flex justify-between w-full pr-2"
              >
                <div className="flex flex-col gap-2">
                  <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center text-highlight text-xl font-black">
                    <span>@</span>
                  </div>
                  <h2 className="font-medium text-lg">{short(accountId)}</h2>
                </div>
                <nav>
                  <div className="flex gap-3 items-center text-lg">
                    <button className="text-muted-foreground hover:text-foreground duration-300 cursor-pointer">
                      <FontAwesomeIcon icon={faGear} />
                    </button>
                    <button className="text-muted-foreground hover:text-chart-5 duration-300 cursor-pointer">
                      <FontAwesomeIcon icon={faPowerOff} />
                    </button>
                  </div>
                </nav>
              </section>

              <div
                aria-label="List Game Library"
                className="grid grid-cols-2 w-full gap-2"
              >
                <Link
                  href={"/my-games"}
                  onClick={onClose}
                  className="bg-accent/20 hover:bg-accent/30 duration-300 text-highlight w-full rounded-xl p-4 font-medium flex flex-col gap-2"
                >
                  <FontAwesomeIcon icon={faPuzzlePiece} className="text-2xl" />
                  <span>My Games</span>
                </Link>
                <Link
                  href={""}
                  onClick={onClose}
                  className="bg-accent/20 text-highlight w-full rounded-xl p-4 font-medium opacity-50 cursor-not-allowed flex flex-col gap-2"
                >
                  <FontAwesomeIcon icon={faShirt} className="text-2xl" />
                  <span>My Items</span>
                </Link>
              </div>
              <Link
                href={"https://studio.peridotvault.com"}
                onClick={onClose}
                className={
                  "ring ring-white/20 w-full rounded-xl flex gap-1 items-center justify-center p-2 hover:bg-white/10 duration-300"
                }
              >
                <span>Go To Studio</span>
                <FontAwesomeIcon icon={faMicrophoneLines} />
              </Link>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
