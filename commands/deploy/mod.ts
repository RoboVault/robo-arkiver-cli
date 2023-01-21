import { wait } from "../../deps.ts";
import { cleanup } from "./cleanup.ts";
import { pkg } from "./pkg.ts";
import { upload } from "./upload.ts";

export const action = async (options: { dir: string }) => {
  const spinner = wait("Packaging...").start();

  try {
    // package directory
    const pkgName = await pkg(options);

    spinner.text = "Uploading package...";
    // upload package
    await upload(pkgName);

    spinner.text = "Cleaning up...";
    // cleanup
    await cleanup();

    spinner.succeed("Deployed successfully!");
  } catch (error) {
    spinner.fail("Deployment failed");
    throw error;
  }

  Deno.exit();
};
