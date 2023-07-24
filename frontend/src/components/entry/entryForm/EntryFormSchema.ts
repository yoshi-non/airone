import { z } from "zod";

import { EditableEntry } from "./EditableEntry";

import { AttributeTypes } from "services/Constants";
import { schemaForType } from "services/ZodSchemaUtil";

// A schema that's compatible with existing types
// TODO rethink it, e.g. consider to use union as a type of value
export const schema = schemaForType<EditableEntry>()(
  z.object({
    name: z.string().trim().min(1, "エントリ名は必須です").default(""),
    schema: z.object({
      id: z.number(),
      name: z.string(),
    }),
    attrs: z
      .record(
        z.string().min(1),
        z
          .object({
            // TODO remove these fields? it should be given by Entity
            index: z.number(),
            type: z.number(),
            isMandatory: z.boolean().default(false),
            schema: z.object({
              id: z.number(),
              name: z.string(),
            }),
            value: z.object({
              asBoolean: z.boolean().default(false).optional(),
              asString: z.string().default("").optional(),
              asArrayString: z
                .array(
                  z.object({
                    value: z.string(),
                  })
                )
                .optional(),
              asObject: z
                .object({
                  id: z.number(),
                  name: z.string(),
                  _boolean: z.boolean().default(false),
                })
                .nullable()
                .optional(),
              asArrayObject: z
                .array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    _boolean: z.boolean().default(false),
                  })
                )
                .optional(),
              asNamedObject: z
                .object({
                  name: z.string(),
                  object: z
                    .object({
                      id: z.number(),
                      name: z.string(),
                      _boolean: z.boolean().default(false),
                    })
                    .nullable()
                    .default(null),
                })
                .optional(),
              asArrayNamedObject: z
                .array(
                  z.object({
                    name: z.string(),
                    object: z
                      .object({
                        id: z.number(),
                        name: z.string(),
                        _boolean: z.boolean().default(false),
                      })
                      .nullable()
                      .default(null),
                  })
                )
                .optional(),
              asGroup: z
                .object({
                  id: z.number(),
                  name: z.string(),
                })
                .nullable()
                .optional(),
              asArrayGroup: z
                .array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                  })
                )
                .optional(),
              asRole: z
                .object({
                  id: z.number(),
                  name: z.string(),
                })
                .nullable()
                .optional(),
              asArrayRole: z
                .array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                  })
                )
                .optional(),
            }),
          })
          .refine(
            (value) => {
              if (!value.isMandatory) {
                return true;
              }

              switch (value.type) {
                case AttributeTypes.string.type:
                case AttributeTypes.text.type:
                case AttributeTypes.date.type:
                  return value.value.asString !== "";
                case AttributeTypes.array_string.type:
                  return (
                    value.value.asArrayString?.some((v) => v.value !== "") ??
                    false
                  );
                case AttributeTypes.object.type:
                  return value.value.asObject != null;
                case AttributeTypes.array_object.type:
                  return (
                    value.value.asArrayObject?.some((v) => v != null) ?? false
                  );
                case AttributeTypes.named_object.type:
                  return (
                    value.value.asNamedObject?.name !== "" ||
                    value.value.asNamedObject?.object != null
                  );
                case AttributeTypes.array_named_object.type:
                  return (
                    value.value.asArrayNamedObject?.some((v) => {
                      return v.name !== "" || v.object != null;
                    }) ?? false
                  );
                case AttributeTypes.group.type:
                  return value.value.asGroup != null;
                case AttributeTypes.array_group.type:
                  return (
                    value.value.asArrayGroup?.some((v) => v != null) ?? false
                  );
                case AttributeTypes.role.type:
                  return value.value.asRole != null;
                case AttributeTypes.array_role.type:
                  return (
                    value.value.asArrayRole?.some((v) => v != null) ?? false
                  );
              }

              return true;
            },
            // TODO specify path to feedback users error cause
            "必須項目です"
          )
      )
      .default({}),
  })
);

export type Schema = z.infer<typeof schema>;