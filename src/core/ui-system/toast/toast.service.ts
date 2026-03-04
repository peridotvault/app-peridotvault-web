import { toast } from "sonner";
import { ToastOpts } from "./toast.type";


const duration: number = 3000;
export const toastService = {
  success: (title: string, opts?: ToastOpts) =>
    toast.success(title, {
      id: opts?.id,
      description: opts?.desc,
      duration: duration,
      classNames: {
        toast: `border-l-6 border-l-chart-2`,
      },
    }),

  error: (title: string, opts?: ToastOpts) =>
    toast.error(title, {
      id: opts?.id,
      description: opts?.desc,
      duration: duration,
      classNames: {
        toast: `border-l-6 border-l-chart-5`,
      },
    }),

  loading: (title: string, desc?: string) =>
    toast.loading(title, {
      description: desc,
      duration: Infinity,
      classNames: {
        toast: `border-l-6 border-l-border`,
      },
    }),
};
