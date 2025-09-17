import {z} from "zod";

const player = z.object({
    name: z.string(),
    ex: z.number()
});
