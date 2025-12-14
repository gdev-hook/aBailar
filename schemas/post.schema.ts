import { z } from 'zod';

export const createPostSchema = z.object({
  image: z.string().min(1, 'Debes seleccionar una imagen'),
  eventDate: z.date({
    error: issue =>
      issue.input === undefined ? 'Requerido' : 'Fecha no válida',
  }),
  province: z.object(
    {
      id: z.number(),
      name: z.string(),
      isoCode: z.string(),
    },
    {
      error: issue =>
        issue.input === undefined ? 'Requerido' : 'Provincia no válida',
    }
  ),
});

export type PostFormData = z.infer<typeof createPostSchema>;
