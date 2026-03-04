import Avatar from "@/shared/components/ui/atoms/Avatar";
import { Input } from "@/shared/components/ui/atoms/Input";

export default function page() {
  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col gap-12 py-8">
      <div className="">
        <Avatar src="" alt="" className="" size={100} />
        <h1 className="mt-4 text-3xl">Edit Profile</h1>
      </div>

      <form action="" className="flex flex-col gap-6">
        <Input label="Username" type="text" placeholder="Add a username" />
        <Input label="Email" type="email" placeholder="email@example.com" />
      </form>
    </section>
  );
}
