## Una obra por tema

Cada tema del estudio parte de una sola obra documentada: un edificio, una publicación, un objeto, un sitio web. Su ficha cita al menos dos fuentes, y al menos una no es Wikipedia. Las fuentes se parafrasean, nunca se citan textualmente, y cada afirmación lleva el número de su fuente, el mismo en español y en inglés.

## Lo documentado y la lectura

La ficha tiene dos partes. Lo documentado recoge lo que dicen las fuentes. La lectura explica qué toma el tema de la obra y por qué: es una interpretación y se presenta como tal. La paleta declara su origen: documentada, si una fuente nombra los colores; muestreada, si salen de una fotografía libre; interpretada, si son una lectura propia.

## Las imágenes

Las fotografías vienen de Wikimedia Commons, que solo acepta contenido libre: cualquiera puede reutilizarlo, modificarlo y usarlo con fines comerciales, y las licencias no comerciales o sin obras derivadas quedan fuera [2]. El estudio se limita a CC0, dominio público, CC BY y CC BY-SA. Cada imagen se reduce a 1600 píxeles como máximo y se convierte a AVIF, y su crédito nombra la autoría, la licencia y la página de origen. Las imágenes viven en el sitio, no en el paquete npm. Cuando una obra no tiene imagen libre, su página enlaza a un archivo o a la fuente principal.

## Una geometría, muchos temas

Todos los temas rellenan el mismo contrato de tokens. Cambian el color, la letra, los bordes, las sombras y el detalle, pero no la geometría: los controles miden 32, 40 o 48 píxeles en todos. Las familias de detalles, como el hormigón o la retícula, añaden textura sin cambiar el tamaño de nada, y una comprobación automática rechaza, en el CSS propio de cada tema, los colores literales, las imágenes y cualquier cambio de geometría fuera de los pseudoelementos.

## El contraste

Cada par de colores del contrato se mide en claro y en oscuro con la fórmula de WCAG 2.2: 4,5:1 para el texto y 3:1 para los bordes de los controles y el indicador de foco, los mínimos que la norma pide al texto normal y a los componentes de interfaz [1]. Los pares se miden también sobre las texturas. Un tema que no cumple no se publica.
