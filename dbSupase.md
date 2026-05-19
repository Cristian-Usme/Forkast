## Table `alergeno`

Tipo de alimento que genera alergia a grupo especifico de personales.

### Columns

| Name          | Type      | Constraints      |
| ------------- | --------- | ---------------- |
| `id_alergeno` | `int8`    | Primary Identity |
| `nombre`      | `varchar` |                  |

## Table `dietas`

### Columns

| Name         | Type      | Constraints      |
| ------------ | --------- | ---------------- |
| `id_dieta`   | `int8`    | Primary Identity |
| `tipo_dieta` | `varchar` |                  |

## Table `estado_ingrediente`

estado de disponibilidad de un alimento

### Columns

| Name            | Type      | Constraints      |
| --------------- | --------- | ---------------- |
| `id_estado`     | `int8`    | Primary Identity |
| `nombre_estado` | `varchar` |                  |

## Table `historia_desperdicio`

historial de desperdicio de inventario de un usuario

### Columns

| Name                     | Type      | Constraints      |
| ------------------------ | --------- | ---------------- |
| `id_desperdicio`         | `int8`    | Primary Identity |
| `id_ingrediente`         | `int4`    | Nullable         |
| `cantidad_desperdiciada` | `numeric` | Nullable         |
| `fecha_descarte`         | `date`    | Nullable         |
| `id_usuario`             | `uuid`    | Nullable         |

## Table `ingrediente`

### Columns

| Name               | Type   | Constraints |
| ------------------ | ------ | ----------- |
| `id_ingrediente`   | `int4` | Primary     |
| `nombre`           | `text` | Nullable    |
| `id_clasificacion` | `int8` | Nullable    |

## Table `inventario_usuario`

consolidar información sobre los alimentos que dispone el usuario

### Columns

| Name                  | Type      | Constraints      |
| --------------------- | --------- | ---------------- |
| `id_inventario`       | `int8`    | Primary Identity |
| `id_ingrediente`      | `int4`    | Nullable         |
| `id_estado`           | `int2`    | Nullable         |
| `cantidad_disponible` | `numeric` | Nullable         |
| `id_usuario`          | `uuid`    | Nullable         |

## Table `lista_compra`

### Columns

| Name               | Type   | Constraints     |
| ------------------ | ------ | --------------- |
| `id_lista`         | `int4` | Primary         |
| `id_plan`          | `int4` | Nullable Unique |
| `fecha_generacion` | `date` | Nullable        |

## Table `lista_producto`

### Columns

| Name             | Type   | Constraints |
| ---------------- | ------ | ----------- |
| `id_lista`       | `int4` | Primary     |
| `id_producto`    | `int4` | Primary     |
| `cantidad_total` | `int4` | Nullable    |

## Table `niveles_dificultad`

### Columns

| Name            | Type      | Constraints      |
| --------------- | --------- | ---------------- |
| `id_dificultad` | `int8`    | Primary Identity |
| `nivel`         | `varchar` |                  |

## Table `plan_receta`

### Columns

| Name          | Type   | Constraints |
| ------------- | ------ | ----------- |
| `id_plan`     | `int4` | Primary     |
| `id_receta`   | `int4` | Primary     |
| `fecha`       | `date` | Primary     |
| `tipo_comida` | `text` | Nullable    |

## Table `plan_semanal`

### Columns

| Name           | Type   | Constraints |
| -------------- | ------ | ----------- |
| `id_plan`      | `int4` | Primary     |
| `fecha_inicio` | `date` | Nullable    |
| `fecha_fin`    | `date` | Nullable    |
| `id_usuario`   | `uuid` | Nullable    |

## Table `producto_supermercado`

tabla intermedia entre ingredientes y producto correspondiente.

### Columns

| Name               | Type      | Constraints      |
| ------------------ | --------- | ---------------- |
| `id_producto`      | `int8`    | Primary Identity |
| `id_ingrediente`   | `int4`    |                  |
| `nombre_comercial` | `varchar` | Nullable         |
| `id_supermercado`  | `int8`    | Nullable         |
| `cantidad`         | `int8`    | Nullable         |
| `precio`           | `int8`    | Nullable         |
| `id_unidad`        | `int8`    | Nullable         |

## Table `receta_dieta`

### Columns

| Name        | Type   | Constraints |
| ----------- | ------ | ----------- |
| `id_receta` | `int4` | Primary     |
| `id_dieta`  | `int4` | Primary     |

## Table `receta_ingrediente`

### Columns

| Name             | Type      | Constraints |
| ---------------- | --------- | ----------- |
| `id_receta`      | `int4`    | Primary     |
| `id_ingrediente` | `int4`    | Primary     |
| `cantidad`       | `numeric` | Nullable    |
| `id_unidad`      | `int8`    | Nullable    |

## Table `recetas`

### Columns

| Name             | Type   | Constraints |
| ---------------- | ------ | ----------- |
| `id_receta`      | `int4` | Primary     |
| `nombre`         | `text` | Nullable    |
| `descripcion`    | `text` | Nullable    |
| `id_tipo_cocina` | `int8` | Nullable    |
| `id_dificultad`  | `int8` | Nullable    |
| `duracion`       | `int4` | Nullable    |

## Table `supermercados`

Lista de supermercados disponibles

### Columns

| Name              | Type      | Constraints      |
| ----------------- | --------- | ---------------- |
| `id_supermercado` | `int8`    | Primary Identity |
| `supermercado`    | `varchar` | Nullable         |

## Table `tipos_cocina`

### Columns

| Name             | Type      | Constraints      |
| ---------------- | --------- | ---------------- |
| `id_tipo_cocina` | `int8`    | Primary Identity |
| `tipo_cocina`    | `varchar` | Nullable         |

## Table `unidad_medida`

### Columns

| Name        | Type      | Constraints      |
| ----------- | --------- | ---------------- |
| `id_unidad` | `int8`    | Primary Identity |
| `unidad`    | `varchar` | Nullable         |

## Table `usuario`

### Columns

| Name                  | Type      | Constraints |
| --------------------- | --------- | ----------- |
| `nombre`              | `text`    |             |
| `presupuesto_semanal` | `numeric` | Nullable    |
| `nivel_dificultad`    | `int4`    | Nullable    |
| `id_usuario`          | `uuid`    | Primary     |

## Table `usuario_alergeno`

tabla intermedia entre usuarios y alergias.

### Columns

| Name          | Type   | Constraints |
| ------------- | ------ | ----------- |
| `id_alergeno` | `int8` |             |
| `id_usuario`  | `uuid` | Nullable    |

## Table `usuario_dieta`

### Columns

| Name         | Type   | Constraints |
| ------------ | ------ | ----------- |
| `id_dieta`   | `int8` |             |
| `id_usuario` | `uuid` | Nullable    |
