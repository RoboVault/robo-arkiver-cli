import { contentType } from "https://deno.land/std@0.173.0/media_types/mod.ts";

const type = contentType(".tar");
console.log(type);
