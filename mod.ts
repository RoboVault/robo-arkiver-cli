import { Command } from "./deps.ts";
import { deploy, login, signup, signout } from "./commands/mod.ts";

if (import.meta.main) {
  const command = new Command()
    .name("robo-arkiver-cli")
    .version("0.1.0")
    .description("The CLI tool for robo-arkiver");

  // login
  command
    .command("login", "Login to robo-arkiver")
    .option("-e, --email <email:string>", "Email address")
    .option("-p, --password <password:string>", "Password")
    .action(login.action);

  // signup
  command
    .command("signup", "Signup to robo-arkiver")
    .option("-e, --email <email:string>", "Email address")
    .option("-p, --password <password:string>", "Password")
    .action(signup.action);

  // signout
  command
    .command("signout", "Signout from robo-arkiver")
    .action(signout.action);

  // deploy
  command
    .command("deploy", "Deploy arkive")
    .option("-d, --dir <dir:string>", "Root directory of arkive", {
      default: ".",
    })
    .action(deploy.action);

  await command.parse(Deno.args);
}
