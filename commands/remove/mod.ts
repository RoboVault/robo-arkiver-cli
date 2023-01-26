import { wait } from "../../deps.ts";
import { login } from "../login/mod.ts";
import { getSupabaseClient } from "../utils.ts";

export const action = async (arkiveName: string) => {
  const spinner = wait("Deleting...").start();

  try {
    // delete package
    const supabase = getSupabaseClient();
    const sessionRes = await supabase.auth.getSession();

    if (!sessionRes.data.session) {
      await login({}, supabase);
    }

    const userRes = await supabase.auth.getUser();
    if (userRes.error) {
      throw userRes.error;
    }

    const deleteRes = await supabase
      .from("arkive")
      .delete()
      .eq("user_id", userRes.data.user.id)
      .eq("name", arkiveName);

    if (deleteRes.error) {
      throw deleteRes.error;
    }

    const getPackageRes = await supabase.storage
      .from("packages")
      .list(`${userRes.data.user.id}/${arkiveName}`);

    console.log(getPackageRes.data);

    if (getPackageRes.error) {
      throw getPackageRes.error;
    }

    const deletePackagesRes = await supabase.storage
      .from("packages")
      .remove(
        getPackageRes.data.map(
          (pkg) => `${userRes.data.user.id}/${arkiveName}/${pkg.name}`
        )
      );

    if (deletePackagesRes.error) {
      throw deletePackagesRes.error;
    }

    spinner.succeed("Deleted successfully!");
  } catch (error) {
    spinner.fail("Deletion failed: " + error.message);
    console.error(error);
  }

  Deno.exit();
};
