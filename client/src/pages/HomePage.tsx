import Messages from "../components/Messages/Messages";
import { useServer } from "../store/useServer";
import CreateMessage from "../components/Messages/CreateMessage";
import Members from "../components/Members";
function HomePage() {
  const server = useServer((state) => state.server);

  return (
    <>
      <div className="w-full border-b dark:border-white/50 h-12">
        {server?.name}
      </div>

      {server?.id && (
        <div className="flex">
          <main className="w-full">
            <Messages />
            <CreateMessage />
          </main>
          <Members />
        </div>
      )}
    </>
  );
}

export default HomePage;
