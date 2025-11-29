"use client"

import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik"
import * as Yup from "yup"
import { useCreateAlbum } from "@/app/hooks/useCreateAlbum"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Lock, FileText, Loader2 } from "lucide-react"

interface CreateAlbumValues {
  name: string
  description: string
  eventDate: string
  password: string
}

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre del álbum es requerido").max(100, "Máximo 100 caracteres"),
  description: Yup.string().max(500, "Máximo 500 caracteres"),
  eventDate: Yup.date().required("La fecha del evento es requerida").typeError("Ingresa una fecha válida"),
  password: Yup.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
})

const initialValues: CreateAlbumValues = {
  name: "",
  description: "",
  eventDate: "",
  password: "",
}

export function CreateAlbumForm() {
  const { mutate: createAlbum, isPending, error } = useCreateAlbum()

  const handleSubmit = (values: CreateAlbumValues, { setSubmitting }: FormikHelpers<CreateAlbumValues>) => {
    createAlbum(
      {
        name: values.name,
        description: values.description || undefined,
        eventDate: values.eventDate,
        password: values.password || undefined,
      },
      {
        onSettled: () => {
          setSubmitting(false)
        },
      },
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-card-foreground">Crear nuevo álbum</h2>
        <p className="text-muted-foreground mt-1">Completa los datos para crear tu álbum colaborativo</p>
      </div>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-5">
            {/* Nombre del álbum */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-card-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Nombre del álbum
              </Label>
              <Field
                as={Input}
                id="name"
                name="name"
                placeholder="Ej: Boda de María y Juan"
                className={`bg-input border-border text-card-foreground placeholder:text-muted-foreground ${
                  errors.name && touched.name ? "border-destructive" : ""
                }`}
              />
              <ErrorMessage name="name" component="p" className="text-sm text-destructive" />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-card-foreground">
                Descripción (opcional)
              </Label>
              <Field
                as={Textarea}
                id="description"
                name="description"
                placeholder="Añade una descripción para tu álbum..."
                rows={3}
                className={`bg-input border-border text-card-foreground placeholder:text-muted-foreground resize-none ${
                  errors.description && touched.description ? "border-destructive" : ""
                }`}
              />
              <ErrorMessage name="description" component="p" className="text-sm text-destructive" />
            </div>

            {/* Fecha del evento */}
            <div className="space-y-2">
              <Label htmlFor="eventDate" className="flex items-center gap-2 text-card-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Fecha del evento
              </Label>
              <Field
                as={Input}
                id="eventDate"
                name="eventDate"
                type="date"
                className={`bg-input border-border text-card-foreground ${
                  errors.eventDate && touched.eventDate ? "border-destructive" : ""
                }`}
              />
              <ErrorMessage name="eventDate" component="p" className="text-sm text-destructive" />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-card-foreground">
                <Lock className="h-4 w-4 text-primary" />
                Contraseña (opcional)
              </Label>
              <Field
                as={Input}
                id="password"
                name="password"
                type="password"
                placeholder="Protege tu álbum con contraseña"
                className={`bg-input border-border text-card-foreground placeholder:text-muted-foreground ${
                  errors.password && touched.password ? "border-destructive" : ""
                }`}
              />
              <ErrorMessage name="password" component="p" className="text-sm text-destructive" />
              <p className="text-xs text-muted-foreground">
                Si añades una contraseña, los visitantes deberán ingresarla para ver las fotos
              </p>
            </div>

            {/* Error general */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">Error al crear el álbum. Por favor, intenta de nuevo.</p>
              </div>
            )}

            {/* Botón de envío */}
            <Button
              type="submit"
              disabled={isPending || isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-5"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando álbum...
                </>
              ) : (
                "Crear álbum"
              )}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
