"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useVerifyPassword } from "@/app/hooks/useVerifyPassword"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Loader2, Camera } from "lucide-react"

interface PasswordModalProps {
  albumId: string
  albumName: string
  onSuccess: () => void
}

const validationSchema = Yup.object({
  password: Yup.string().required("La contraseña es requerida"),
})

export function PasswordModal({ albumId, albumName, onSuccess }: PasswordModalProps) {
  const { mutate: verifyPassword, isPending, error } = useVerifyPassword(albumId)

  const handleSubmit = (values: { password: string }) => {
    verifyPassword(values.password, {
      onSuccess: (data) => {
        if (data.valid) {
          onSuccess()
        }
      },
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Camera className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">PhotoShare</span>
          </div>

          {/* Título */}
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-xl font-serif font-bold text-card-foreground">Álbum protegido</h2>
            <p className="text-muted-foreground mt-2">
              El álbum <span className="font-medium text-foreground">{albumName}</span> está protegido con contraseña.
            </p>
          </div>

          <Formik initialValues={{ password: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-card-foreground">
                    Contraseña
                  </Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Ingresa la contraseña"
                    autoFocus
                    className={`bg-input border-border text-card-foreground placeholder:text-muted-foreground ${
                      errors.password && touched.password ? "border-destructive" : ""
                    }`}
                  />
                  <ErrorMessage name="password" component="p" className="text-sm text-destructive" />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">Contraseña incorrecta. Por favor, intenta de nuevo.</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Acceder al álbum"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
