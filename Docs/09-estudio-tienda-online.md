---
title: LRC WEB · Documento 9 — Estudio de la tienda online de electrodomésticos (Black Friday)
fecha: 2026-10-29
estado: Estudio previo, pendiente de decisiones del cliente
---

# Estudio: tienda online de electrodomésticos por temporadas

Petición del cliente: un apartado de tienda dentro de la web para vender electrodomésticos en
**Black Friday** (y otras fechas especiales), con un modelo de venta parecido al de MediaMarkt,
envíos centrados en **Madrid y Toledo** y opción de llegar a Barcelona, Galicia, etc. Proveedor:
**Cemevisa** (cemevisa.com).

## 1. Calendario

- Black Friday 2026: **viernes 27 de noviembre**. Semana Black Friday: lunes 23 a domingo 29.
  Cyber Monday: lunes 30.
- Hoy: 29 de octubre → **unas 3,5 semanas** para tenerlo vendiendo. Es justo: obliga a elegir
  una solución probada y un catálogo acotado.

## 2. El proveedor: Cemevisa

Lo comprobado en su web:

- Es un **mayorista B2B** de electrodomésticos (vende a profesionales, no al público), con 9
  plataformas logísticas en España, incluida Galicia, y más de 60 marcas (Bosch, Siemens, Balay,
  AEG, Samsung, LG, Teka, Smeg, Liebherr...).
- El **catálogo es público**: nombre, referencia, descripción, clase energética y fotos se ven sin
  entrar.
- **Precios y stock requieren login** (zona "Cliente / Clave"; el stock se consulta por artículo en
  `/catalogo/stock.php`).
- Ofrece catálogos en PDF (Outlet, PAE, Electrónica de consumo...).
- **No hay API pública, ni feed documentado, ni servidor MCP** para conectarse. No existe una forma
  "oficial" de que la web lea su catálogo automáticamente.

### Opciones para conectar productos

| Opción | Cómo | Valoración |
|---|---|---|
| **A. Fichero de tarifa** (CSV/Excel) | Pedir a Cemevisa el export de artículos: referencia, EAN, descripción, PVP recomendado, precio neto, stock, URL de imagen | **Recomendada.** Los mayoristas suelen tenerlo para sus clientes. Se importa en minutos y se puede actualizar cada día |
| B. Feed/API privada | Preguntar si tienen feed XML/EDI o API para clientes | La mejor si existe (stock automático), pero no hay indicios públicos |
| C. Automatizar el portal con las claves | Un script entra con el usuario del cliente y extrae datos | **No recomendada**: frágil (cualquier cambio de su web lo rompe), puede incumplir sus condiciones de uso y obliga a manejar credenciales del cliente |
| D. Carga manual | Seleccionar 30-80 productos y darlos de alta a mano | Viable para el primer Black Friday si no llega el fichero a tiempo |

Preguntas imprescindibles para Cemevisa:

1. Nos podéis dar la tarifa/catálogo en Excel o CSV, y con qué frecuencia se actualiza?
2. Hacéis **envío directo al cliente final** (dropshipping)? Desde qué plataforma, en qué plazos y con qué coste por zona?
3. Las fotos y textos del catálogo se pueden usar para venta online?
4. Hay marcas con **distribución selectiva** que no permiten venta online sin autorización?
5. Cómo se gestionan devoluciones, productos dañados en transporte y garantías?
6. Vais a tener precios especiales para Black Friday? Desde qué fecha?

## 3. Modelo de venta de referencia (MediaMarkt) adaptado a LRC

| Elemento | MediaMarkt | Propuesta LRC |
|---|---|---|
| Catálogo | Categorías + filtros (marca, precio, clase energética, capacidad) | Igual, con un catálogo acotado de Black Friday |
| Ficha | Galería, precio, precio anterior, etiqueta energética, ficha técnica, plazo de entrega por código postal | Igual. La etiqueta energética y la ficha de información de producto son **obligatorias** |
| Servicios en la compra | Entrega, instalación, retirada del aparato viejo (niveles de servicio con precio) | Entrega + retirada del usado incluidas (obligatorio, ver 4.3) + **instalación opcional**: aquí LRC tiene ventaja porque ya tiene equipo de montaje |
| Envío | Por zonas, franjas horarias | **Zona 1: Madrid y Toledo** con reparto propio o de confianza; **zona 2: resto de península** con transportista especializado; Baleares, Canarias, Ceuta y Melilla fuera de la primera versión |
| Pago | Tarjeta, Bizum, PayPal, financiación | Tarjeta + Bizum; financiación opcional más adelante |
| Devoluciones | 30 días (más que los 14 legales) | 14 días legales como mínimo; ampliar a 30 es una decisión comercial |
| Garantía | 3 años legal | 3 años legal + extensión de garantía de Cemevisa como extra |

## 4. Requisitos legales (España)

1. **Datos de la empresa completos** (LSSI-CE): razón social, NIF y domicilio ya están en la web;
   **faltan los datos registrales** (tomo, folio, hoja del Registro Mercantil) → bloqueante: no se
   puede vender sin ellos.
2. **Condiciones generales de venta**, **derecho de desistimiento de 14 días** con formulario de
   desistimiento, política de envíos y devoluciones, y **garantía legal de 3 años**.
3. **RAEE (RD 110/2015)**: el vendedor (también a distancia) debe **aceptar gratis el aparato usado
   equivalente al entregar el nuevo** (1x1), y solo puede vender aparatos de fabricantes inscritos
   en el registro (REI-RAEE), que debe constar en la factura. El transporte del usado puede hacerlo
   el mismo transportista que entrega el nuevo, con albarán. Revisar con el gestor si LRC necesita
   alguna inscripción como distribuidor en su comunidad autónoma.
4. **Etiquetado energético (Reglamento UE 2017/1369)**: en la venta online hay que mostrar la clase
   energética (flecha con la clase y la escala) junto al precio, con acceso a la etiqueta completa y
   a la ficha de información del producto (base de datos europea **EPREL**).
5. **Precios de Black Friday (art. 20 de la Ley 7/1996, Directiva Ómnibus)**: si se anuncia una
   rebaja, el "precio anterior" debe ser **el más bajo de los 30 días previos**. Hay que guardar el
   historial de precios desde ya, o no anunciar porcentajes de descuento.
6. Precios **con IVA incluido** y gastos de envío claros antes de pagar.
7. Política de privacidad actualizada (datos de pedidos, facturación) y consentimiento de cookies
   (ya existe en la web).

## 5. Opciones técnicas

| | **1. Shopify como motor** (recomendada) | 2. Tienda a medida en Next.js |
|---|---|---|
| Qué es | Shopify gestiona productos, carrito, pagos, impuestos y pedidos. La web enlaza a la tienda (`tienda.lareinadelacasa.com` con la plantilla de Shopify adaptada a la marca) o la integra en `/tienda` con su API (*headless*) | Catálogo en Sanity, pagos con Stripe Checkout, pedidos en Supabase, todo programado |
| Tiempo hasta vender | **1-2 semanas** (subdominio) / 3 semanas (headless) | 4-6 semanas |
| Coste | ~30-40 €/mes + comisión de pago (~1,5-2 %) | Sin cuota, comisión Stripe (~1,5 %) + horas de desarrollo y mantenimiento |
| Importar catálogo | Importación CSV nativa | Hay que programarla |
| Abrir/cerrar por temporadas | Proteger la tienda con contraseña o ocultar productos; la web muestra u oculta el enlace | Interruptor propio |
| Riesgo para Black Friday | Bajo: plataforma probada para picos de tráfico | Alto: cualquier fallo en pagos o stock se descubre con clientes reales |

**Recomendación (revisada 2026-10-29)**: Shopify como motor **integrado en la web actual**: el
catálogo, las fichas y el carrito viven en `lareinadelacasa.com/tienda` (Next.js leyendo la
Storefront API de Shopify, con el diseño de LRC), y el **pago se hace en el checkout de Shopify**,
que se puede servir en un subdominio propio (`checkout.lareinadelacasa.com`). Así no hay que
programar pagos, impuestos ni pedidos, que es donde está el riesgo. Plan B si el tiempo se echa
encima: la tienda de Shopify con su plantilla en `tienda.lareinadelacasa.com` y un enlace desde el
menú.

Formas de juntar Shopify con la web, de menos a más integración:

| Forma | Resultado | Esfuerzo |
|---|---|---|
| Enlace a `tienda.lareinadelacasa.com` (plantilla Shopify) | Dos webs con la misma marca | Muy bajo |
| Buy Button (botón incrustado) | Botón de compra en páginas de la web | Bajo, pero limitado para un catálogo con filtros |
| **Storefront API + checkout de Shopify** | Tienda dentro de la web, pago en Shopify | Medio: ~2 semanas |
| Headless completo (incluido checkout propio) | Todo en la web | Alto; no compensa | Hay que medirlo todo igual:
GA4 + eventos de comercio (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`).

### Apertura por temporadas

- Un interruptor en Sanity (`siteSettings.storeOpen` + fechas de apertura y cierre) que el cliente
  pueda activar sin programador.
- Tienda cerrada: el menú oculta "Tienda" y `/tienda` muestra una página de **"Próximamente /
  avísame"** que capta emails o teléfonos para la siguiente campaña (alimenta los leads).
- Tienda abierta: banner de Black Friday en la home y en el menú.

## 6. Logística

- **Madrid y Toledo**: reparto con el equipo o transportista habitual de LRC, con entrega en
  domicilio, retirada del usado e instalación opcional (venta cruzada con encimeras y reformas).
- **Resto de península**: transportista especializado en gran electrodoméstico (entrega con 2
  personas, a pie de calle o en domicilio) o envío directo desde Cemevisa si lo ofrece, ya que tiene
  plataforma en Galicia y otras zonas.
- Calcular el coste de envío por **código postal** y **tamaño** (gran electrodoméstico frente a
  pequeño electrodoméstico) antes de fijar precios.
- Riesgo principal: un frigorífico dañado en transporte o una devolución de 80 kg a 600 km. Hay que
  dejarlo resuelto en las condiciones de venta y en el acuerdo con el transportista.

## 7. Plan propuesto

| Semana | Tareas |
|---|---|
| 1 (29 oct - 4 nov) | Respuestas de Cemevisa, datos fiscales, decisión de plataforma y zonas de envío, selección de 30-80 productos |
| 2 (5 - 11 nov) | Alta de Shopify, importación de catálogo, pagos, envíos por zonas, textos legales |
| 3 (12 - 18 nov) | Diseño con la marca LRC, interruptor en la web, página "avísame", analítica de comercio, pruebas de compra reales |
| 4 (19 - 23 nov) | Precios de Black Friday (respetando la regla de 30 días), revisión legal, lanzamiento el **lunes 23** |

## 8. Lo que necesitamos del cliente

1. Datos fiscales completos de la empresa.
2. Contacto comercial en Cemevisa y respuestas a las preguntas de la sección 2.
3. Lista de productos o categorías que quiere vender, y margen objetivo.
4. Decisión sobre zonas de envío, precios de envío e instalación.
5. Cuenta bancaria y documentación de la empresa para la pasarela de pago.
6. Quién atiende pedidos, incidencias y devoluciones durante la campaña.

## Fuentes

- Cemevisa: https://www.cemevisa.com (catálogo público, acceso de clientes)
- Fecha Black Friday 2026: https://www.trecebits.com/cuando-se-celebra-black-friday-ofertas-descuentos/
- RAEE para distribuidores (MITECO): https://www.miteco.gob.es/es/calidad-y-evaluacion-ambiental/temas/prevencion-y-gestion-residuos/resumendistribuciondeaeerdraee_tcm30-192521.pdf
- Reglamento (UE) 2017/1369 de etiquetado energético: https://boe.gob.es/doue/2017/198/L00001-00023.pdf
- Precio anterior = más bajo de 30 días (OCU): https://www.ocu.org/organizacion/prensa/notas-de-prensa/2018/denunicaworten231118
- TJUE, asunto C-330/23 sobre reducciones de precio: https://aquieuropa.com/la-justicia-europea-exige-que-las-rebajas-se-basen-en-el-precio-mas-bajo-de-los-ultimos-30-dias
