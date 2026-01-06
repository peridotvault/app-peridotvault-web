import { IMAGE_LOADING } from "@/shared/constants/image";

export default function MyGames() {
  return (
    <main className="max-w-400 w-full mx-auto p-8 flex flex-col gap-8">
      <section className="mt-20">
        <h1 className="text-4xl font-medium">My Games</h1>
      </section>

      <section className="grid grid-cols-4">
        {Array.from({ length: 5 }).map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 hover:bg-white/5 rounded-2xl duration-300 p-3"
          >
            <img
              src={IMAGE_LOADING}
              alt="Game Cover Image"
              className="aspect-video w-full rounded-2xl"
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-medium line-clamp-2">
                Peridot Game
              </h2>
              <span aria-label="Game Studio" className="text-white/50">
                Antigane
              </span>
            </div>
            <div className="">
              <button className="bg-accent py-2 px-4 cursor-pointer rounded-lg">
                Download
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
