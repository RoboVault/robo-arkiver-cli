import { getSupabaseClient } from "../utils.ts";
import { login } from "../login/mod.ts";

export const upload = async (pkgName: string) => {
  const supabase = getSupabaseClient();
  const sessionRes = await supabase.auth.getSession();

  if (!sessionRes.data.session) {
    await login({}, supabase);
  }

  const userRes = await supabase.auth.getUser();
  if (userRes.error) {
    throw userRes.error;
  }

  const remotePath = `${userRes.data!.user.id}/${pkgName}`;
  const localPath = `.pkg/${pkgName}`;

  console.log(remotePath, localPath);

  const { error } = await supabase.storage
    .from("packages")
    .upload(remotePath, Deno.readFileSync(localPath), {
      contentType: "application/gzip",
    });

  if (error) {
    throw error;
  }
};
