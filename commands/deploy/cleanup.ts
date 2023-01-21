export const cleanup = async () => {
    await Deno.remove(".pkg", { recursive: true });
}