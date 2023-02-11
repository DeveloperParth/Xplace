import {
  Avatar,
  Text,
  Group,
  Anchor,
  Stack,
  Box,
  createStyles,
  Divider,
  Badge,
  ActionIcon,
  Popover,
  Loader,
  UnstyledButton,
} from "@mantine/core";
import moment from "moment";
import { useServer } from "../../store/useServer";
import { PermissionTypes } from "../../types";
import { IconPlus } from "@tabler/icons";
import { addUserToRole, getRoles, removeUserFromRole } from "../../api";
import { queryClient } from "../../main";
import { useQuery } from "@tanstack/react-query";

function ProfileCard({ member }: { member: Entity.ServerMember }) {
  const { classes, cx } = useStyles();
  const hasPermission = useServer((state) => state.hasPermission);
  const roleRemoveHandler = async (id: string) => {
    if (!hasPermission(PermissionTypes.manageRoles)) return;
    await removeUserFromRole({
      userId: member.User.id,
      serverId: member.serverId,
      roleId: id,
    });
    queryClient.invalidateQueries(["members"]);
  };
  const addRoleHandler = async (id: string) => {
    if (!hasPermission(PermissionTypes.manageRoles)) return;
    await addUserToRole({
      userId: member.User.id,
      serverId: member.serverId,
      roleId: id,
    });
    queryClient.invalidateQueries(["members"]);
  };
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles", member.serverId],
    queryFn: () => getRoles(member.serverId),
  });
  return (
    <Box className={classes.outerContainer}>
      <div
        style={{
          minWidth: "340px",
          minHeight: "60px",
          background: "#12afca",
          position: "relative",
        }}
      >
        <img
          src="https://i.pravatar.cc/300"
          alt="avatar"
          className={classes.avatar}
        />
      </div>

      <Box className={classes.innerContainer}>
        <Text fw={600}>{member.User.name}</Text>
        <Divider />
        <Box>
          <Text
            size="xs"
            style={{ display: "flex", fontWeight: "700", marginBottom: "6px" }}
          >
            MEMBER SINCE
          </Text>
          <Text size="xs">
            {moment(member.createdAt).format("MMMM Do YYYY")}
          </Text>
        </Box>
        <Box>
          <Text
            size="xs"
            style={{ display: "flex", fontWeight: "700", marginBottom: "6px" }}
          >
            {member.Roles?.length ? "ROLES" : "NO ROLES"}
          </Text>
          <Box>
            {member.Roles?.map((role, i) => {
              return (
                <Badge
                  key={role.id}
                  onClick={() => roleRemoveHandler(role.id)}
                  bg="#292b2f"
                  c={role.color}
                  variant="filled"
                  className={cx(classes.badge, {
                    [classes.hoverEffect]: hasPermission(
                      PermissionTypes.manageRoles
                    ),
                  })}
                  leftSection={
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={cx(classes.roleSvg)}
                    >
                      <circle cx="5" cy="5" r="5" fill={role.color} />
                      <line
                        x1="2"
                        y1="2"
                        x2="8"
                        y2="8"
                        stroke="white"
                        strokeWidth="1"
                      ></line>
                      <line
                        x1="8"
                        y1="2"
                        x2="2"
                        y2="8"
                        stroke="white"
                        strokeWidth="1"
                      ></line>
                    </svg>
                  }
                >
                  {role.name}
                </Badge>
              );
            })}
            {hasPermission(PermissionTypes.manageRoles) && (
              <Popover withArrow width={200}>
                <Popover.Target>
                  <Badge
                    sx={{
                      backgroundColor: "#292b2f",
                    }}
                    size="sm"
                  >
                    <ActionIcon>
                      <IconPlus size={10} />
                    </ActionIcon>
                  </Badge>
                </Popover.Target>
                <Popover.Dropdown>
                  {rolesLoading ? (
                    <Loader />
                  ) : (
                    roles?.map((role) => {
                      return (
                        <UnstyledButton
                          key={role.id}
                          className={classes.roleButton}
                          onClick={() => {
                            addRoleHandler(role.id);
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="5" cy="5" r="5" fill={role.color} />
                          </svg>
                          <Text size="sm">{role.name}</Text>
                        </UnstyledButton>
                      );
                    })
                  )}
                </Popover.Dropdown>
              </Popover>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = createStyles((theme) => ({
  outerContainer: {
    backgroundColor: "#292b2f",
    position: "absolute",
    right: "105%",
    top: "0",
    width: "340px",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  innerContainer: {
    backgroundColor: "#18191c",
    position: "relative",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    width: "300px",
    height: "300px",
    margin: "28px 16px 16px",
    padding: "10px 12px",
    gap: "10px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    position: "absolute",
    top: "16px",
    left: "22px",
    boxShadow: "0 0 0 7px #292b2f",
  },
  roleSvg: {
    line: {
      display: "none",
    },
  },
  badge: {
    userSelect: "none",
    cursor: "default",
  },
  hoverEffect: {
    "&:hover line": {
      display: "block",
    },
  },
  roleButton: {
    width: "100%",
    padding: "8px 12px",
    textAlign: "left",
    color: "white",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    "&:hover": {
      backgroundColor: "#2f3136",
    },
  },
}));

export default ProfileCard;
