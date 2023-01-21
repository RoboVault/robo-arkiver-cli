import { getSupabaseClient } from "../utils.ts";
import { login } from "../login/mod.ts";

export const upload = async (
  pkgName: string,
  tempPath: string,
  arkiveName: string
) => {
  const supabase = getSupabaseClient();
  const sessionRes = await supabase.auth.getSession();

  if (!sessionRes.data.session) {
    await login({}, supabase);
  }

  const userRes = await supabase.auth.getUser();
  if (userRes.error) {
    throw userRes.error;
  }

  let versionNumber;
  const arkivesRes = await supabase
    .from("arkive")
    .select("id", { count: "exact" })
    .eq("name", arkiveName)
    .eq("owner_id", userRes.data!.user.id);
  if (arkivesRes.error) {
    throw arkivesRes.error;
  }
  if (!arkivesRes.count) {
    versionNumber = 1;
  } else {
    versionNumber = arkivesRes.count + 1;
  }

  const remotePath = `${
    userRes.data!.user.id
  }/${arkiveName}/${versionNumber}.tar.gz`;
  const localPath = `${tempPath}${pkgName}`;

  const uploadRes = await supabase.storage
    .from("packages")
    .upload(remotePath, Deno.readFileSync(localPath), {
      contentType: "application/gzip",
      upsert: true,
    });

  if (uploadRes.error) {
    throw uploadRes.error;
  }

  const saveRes = await supabase.from("arkive").insert({
    version_number: versionNumber,
    name: arkiveName,
    owner_id: userRes.data!.user.id,
  });

  if (saveRes.error) {
    throw saveRes.error;
  }
};
