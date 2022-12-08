import { showNotification } from "@mantine/notifications";
import { MutateFunction, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { joinServer } from "../api";

function InvitationPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { error, mutate } = useMutation<
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
  useEffect(() => {
    mutate(code!);
  }, []);

  return <div>{error?.response?.data.message}</div>;
}

export default InvitationPage;
