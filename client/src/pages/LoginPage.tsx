import React from "react";
import { useAuth } from "../store/useAuth";
import {
  Paper,
  createStyles,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Card,
  TextInput,
} from "@mantine/core";
function LoginPage() {
  const [input, setInput] = React.useState({
    email: "",
    password: "",
    name: "",
  });
  const [type, setType] = React.useState<"login" | "register">("login");
  const { login, register } = useAuth((state) => state);
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (type === "register") {
      register(input.email, input.password, input.name);
    } else {
      login(input.email, input.password);
    }
  };
  const { classes } = useStyles();
  const Register = (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Welcome to Xplace!
        </Title>

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
          name="email"
          value={input.email}
          onChange={changeHandler}
        />
        <TextInput
          label="Name"
          placeholder="Jhon Doe"
          size="md"
          name="name"
          value={input.name}
          onChange={changeHandler}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          name="password"
          value={input.password}
          onChange={changeHandler}
        />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md" onClick={handleSubmit}>
          Register
        </Button>

        <Text align="center" mt="md">
          Already have an account?{" "}
          <Anchor<"a">
            href="#"
            weight={700}
            onClick={(event) => {
              event.preventDefault();
              setType("login");
            }}
          >
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
  if (type === "register") {
    return Register;
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Welcome back to Mantine!
        </Title>

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
          name="email"
          value={input.email}
          onChange={changeHandler}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          name="password"
          value={input.password}
          onChange={changeHandler}
        />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md" onClick={handleSubmit}>
          Login
        </Button>

        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a">
            href="#"
            weight={700}
            onClick={(event) => {
              event.preventDefault();
              setType("register");
            }}
          >
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: 900,
    maxHeight: "100vh",
    width: "100%",
    display: "flex",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    height: "100%",
    width: "min(100%, 450px)",
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export default LoginPage;
