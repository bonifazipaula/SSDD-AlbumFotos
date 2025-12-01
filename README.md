# SSDD-AlbumFotos

## Consigna

### Álbum de Fotos Compartido Temporal

Desarrollar una aplicación para crear álbumes de fotos colaborativos orientados a eventos, donde múltiples personas pueden contribuir con sus fotografías sin necesidad de registrarse.

### Funcionalidades requeridas

Formulario para crear un álbum donde se ingrese: nombre del álbum, descripción breve, fecha del evento y opcionalmente una contraseña de acceso. Al crear el álbum, generar un enlace único para compartir (pueden usar UUID)
Cualquier persona con el enlace puede acceder al álbum; si tiene contraseña, solicitarla antes de mostrar el contenido
Permitir subir fotos con las siguientes restricciones:

- Formatos aceptados: JPG, PNG, WebP
- Tamaño máximo por imagen: 10 MB
  Mostrar todas las fotos del álbum en una galería con diseño en grid responsive
  Mostrar un contador con: cantidad total de fotos y espacio total utilizado (en MB)
  Permitir descargar todas las fotos del álbum comprimidas en un único archivo ZIP
  Implementar expiración automática: los álbumes deben eliminarse (fotos y metadatos) 30 días después de la fecha del evento registrada

#### Aspectos a considerar

- La limpieza de álbumes expirados puede implementarse mediante un endpoint que se ejecute periódicamente (solo dejen implementado el endpoint), o verificando la expiración cada vez que se accede a un álbum. Esto es porque no estamos utilizando cron ni ningún mecanismo similar.
- Considerar mostrar una vista previa (thumbnail) de las imágenes en el grid para mejorar la performance de carga
- Para el hash de contraseñas pueden usar bcrypt o alguna herramienta similar.

## Resolución

Aplicando los temas vistos en las mini practicas, se utilizó Formik y Yup para el formulario de creación del album, utilizando uuid para identicar cada uno. La base de datos utilizada fue MongoDB, usando Mongoose como ODM. Se interactua con la base de datos a través de 3 modelos: Album, Image y Photo.

La distinción entre foto e imagén se basa en un tema optimización, ya que no queremos enviar todas las imagenes de un album al cargar la página, ya que seria una respuesta enorme e ineficiente. Por lo que se decidió guardar los datos binarios en Image, y los metadatos y el id del documento Image que guarda la imagen.

Se aplicó una galería con grid responsive mostrando thumbnails, y una vista de la imagen completa al clickear alguna donde se ve la imagen en una mejor resolución. Una vez creado la estructura siguiendo las indicaciones de la cátedra sobre las buenas prácticas a la hora de desarrollar una aplicación con Next.js, fue sencillo desarrollar la funcionalidad del archivo comprimido de las fotos del album.

Al ser una base de datos NoSQL, se tiene que tener extremo cuidado a la hora de eliminar los albumes ya que no hay delete on cascade automatico, se tiene que ir de menor a mayor, loopeando cada Photo para eliminar su correspondiente Image, para luego hacer llamar DeleteMany en este modelo, y DeleteOne en el album.

Desarrollar esta aplicación con Next.js junto a las demas tecnologías vista en las mini practicas como TanStack Query, nos permitió ver el potencial de escabilidad que tienen este tipo de aplicaciones, cuando son realizadas de forma correcta, siendo extremadamente faciles de extender y entender.
