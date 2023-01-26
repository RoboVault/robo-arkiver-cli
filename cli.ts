import { Command } from "./deps.ts";
import { deploy, login, signup, logout, remove } from "./commands/mod.ts";

if (import.meta.main) {
  const command = new Command()
    .name("arkiver")
    .version("0.1.0")
    .description("The CLI tool for RoboArkiver");

  // login
  command
    .command("login", "Login to RoboArkiver")
    .option("-e, --email <email:string>", "Email address")
    .option("-p, --password <password:string>", "Password")
    .action(login.action);

  // signup
  command
    .command("signup", "Signup to RoboArkiver")
    .option("-e, --email <email:string>", "Email address")
    .option("-p, --password <password:string>", "Password")
    .action(signup.action);

  // signout
  command.command("logout", "Logout from RoboArkiver").action(logout.action);

  // deploy
  command
    .command("deploy", "Deploy arkive")
    .option("-d, --dir <dir:string>", "Root directory of arkive", {
      default: ".",
    })
    .arguments("<arkiveName:string>")
    .action(deploy.action);

  // delete
  command
    .command("delete", "Delete arkive")
    .arguments("<arkiveName:string>")
    .action(async (_, arkiveName) => await remove.action(arkiveName));

  await command.parse(Deno.args);
}
