export const pkg = async (options: { dir: string }) => {
  await Deno.mkdir(".pkg");
  const fileName = crypto.randomUUID() + ".tar.gz";
  const out = ".pkg/" + fileName;

  const process = Deno.run({
    cmd: ["tar", "--exclude=.pkg", "-zcvf", out, options.dir],
    stdout: "piped",
    stderr: "piped",
  });

  const [{ code }, err] = await Promise.all([
    process.status(),
    process.stderrOutput(),
  ]);
  if (code !== 0) {
    const errMsg = `Failed to build package: ${new TextDecoder().decode(err)}`;
    throw new Error(errMsg);
  }

  process.close();

  return fileName;
};