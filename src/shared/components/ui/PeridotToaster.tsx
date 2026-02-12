"use client";

import {
  faCheckCircle,
  faCircleXmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toaster, toast } from "sonner";

export function PeridotToaster() {
  return (
    <Toaster
      position="bottom-right"
      richColors={false}
      visibleToasts={5}
      toastOptions={{
        unstyled: true,

        classNames: {
          toast: `
            group pointer-events-auto
            flex w-[360px] items-center gap-4
            rounded-xl border border-border
            backdrop-blur-xl
            p-4
          `,
          title: `
            font-medium leading-5
            tracking-[0.01em]
          `,
          description: `
            mt-0.5 leading-5 text-white/70
          `,
          icon: `
            shrink-0
          `,
          actionButton: `
            ml-auto inline-flex h-8 items-center justify-center
            rounded-xl px-3 font-semibold
            bg-[#4cff8f] text-[#06120b]
            hover:brightness-110 active:brightness-95
            transition
          `,
          cancelButton: `
            inline-flex h-8 items-center justify-center
            rounded-xl px-3 font-medium
            border border-white/15
            bg-white/5 text-white/80
            hover:bg-white/10
            transition
          `,
        },
      }}
    />
  );
}

export type ToastOpts = {
  id?: string | number;
  desc?: string;
};

const duration: number = 3000;
export const peridotToast = {
  success: (title: string, opts?: ToastOpts) =>
    toast.success(title, {
      id: opts?.id,
      description: opts?.desc,
      duration: duration,
      icon: (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-chart-2 text-lg"
        />
      ),
      classNames: {
        toast: `border-l-6 border-l-chart-2`,
      },
    }),

  error: (title: string, opts?: ToastOpts) =>
    toast.error(title, {
      id: opts?.id,
      description: opts?.desc,
      duration: duration,
      icon: (
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="text-chart-5 text-lg"
        />
      ),
      classNames: {
        toast: `border-l-6 border-l-chart-5`,
      },
    }),

  loading: (title: string, desc?: string) =>
    toast.loading(title, {
      description: desc,
      duration: Infinity,
      icon: (
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-border animate-spin text-lg"
        />
      ),
      classNames: {
        toast: `border-l-6 border-l-border`,
      },
    }),
};
