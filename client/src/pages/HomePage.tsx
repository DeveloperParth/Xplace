import Messages from "../components/Messages/Messages";
import { useServer } from "../store/useServer";
import CreateMessage from "../components/Messages/CreateMessage";
import Members from "../components/Members";
function HomePage() {
  const server = useServer((state) => state.server);

  return (
    <>


      {server?.id && (
        <div className="flex">
          <div className="w-full max-h-full">
            <Messages />
            <CreateMessage />
          </div>
          <Members />
        </div>
      )}
    </>
  );
}

export default HomePage;
