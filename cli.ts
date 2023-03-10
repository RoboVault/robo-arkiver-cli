import { Command } from "./deps.ts";
import { deploy, login, logout, remove, signup } from "./commands/mod.ts";

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
    .option("-u, --username <username:string>", "Username")
    .action(signup.action);

  // signout
  command.command("logout", "Logout from RoboArkiver").action(logout.action);

  // deploy
  command
    .command("deploy", "Deploy arkive")
    .option("--public", "Make arkive public")
    .option("--major", "Deploy as major version")
    .arguments("<dir:string> <arkiveName:string>")
    .action(deploy.action);

  // delete
  command
    .command("delete", "Delete arkive")
    .arguments("<id:number>")
    .action(async (_, id) => await remove.action(id));

  await command.parse(Deno.args);
}
