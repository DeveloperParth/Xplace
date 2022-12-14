import { Button, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getInvitation, joinServer } from "../api";
import { Invitation } from "../types";

function InvitationPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { mutate, isLoading: joiningServerLoading } = useMutation<
    any,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: joinServer,
    onSuccess: () => {
      showNotification({
        title: "Joined server",
        message: "You have successfully joined the server",
      });
      navigate("/", { replace: true });
    },
  });

  const { data } = useQuery<{ invitation: Invitation }>({
    queryKey: ["server", code],
    queryFn: () => getInvitation(code!),
  });
  if (!data?.invitation) return <div>Loading...</div>;
  return (
    <>
      <div>
        <Title>{data?.invitation.Server.name}</Title>
        <p>Invited by {data?.invitation.User.name}</p>

        <Button onClick={() => mutate(code!)} loading={joiningServerLoading}>
          Join {data?.invitation.Server.name}
        </Button>
      </div>
    </>
  );
}

export default InvitationPage;
