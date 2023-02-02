import {
  Attribute,
  EntityDetail,
  EntryAttributeType,
  EntryAttributeValueObject,
} from "apiclient/autogenerated";
import {
  EditableEntry,
  EditableEntryAttrs,
} from "components/entry/entryForm/EditableEntry";
import { DjangoContext } from "services/DjangoContext";

const djangoContext = DjangoContext.getInstance();

// Convert Entry information from server-side value to presentation format.
// (NOTE) It might be needed to be refactored because if server returns proper format with frontend, this is not necessary.
export function formalizeEntryInfo(entry, excludeAttrs) {
  return {
    name: entry.value.name,
    attrs: Object.fromEntries(
      entry.value.attrs
        .filter((attr) => !excludeAttrs.includes(attr.schema.name))
        .filter((attr) => attr.schema.id != 0)
        .map((attr): [string, EditableEntryAttrs] => {
          function getAttrValue(attr: EntryAttributeType) {
            switch (attr.type) {
              case djangoContext?.attrTypeValue.array_string:
                return attr.value?.asArrayString?.length ?? 0 > 0
                  ? attr.value
                  : { asArrayString: [""] };
              case djangoContext?.attrTypeValue.array_named_object:
                return attr.value?.asArrayNamedObject?.length ?? 0 > 0
                  ? attr.value
                  : { asArrayNamedObject: [{ "": null }] };
              default:
                return attr.value;
            }
          }

          return [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              isMandatory: attr.isMandatory,
              schema: attr.schema,
              value: getAttrValue(attr),
            },
          ];
        })
    ),
  };
}

export function initializeEntryInfo(entity: EntityDetail) {
  return {
    name: "",
    attrs: Object.fromEntries(
      entity.attrs.map((attr): [string, EditableEntryAttrs] => [
        attr?.name ?? "",
        {
          id: attr.id,
          type: attr.type,
          isMandatory: attr.isMandatory,
          schema: {
            id: attr.id,
            name: attr.name,
          },
          value: {
            asString: "",
            asBoolean: false,
            asObject: null,
            asGroup: null,
            asRole: null,
            asNamedObject: { "": null },
            asArrayString: [""],
            asArrayObject: [],
            asArrayGroup: [],
            asArrayRole: [],
            asArrayNamedObject: [{ "": null }],
          },
        },
      ])
    ),
  };
}

export function isSubmittable(entryInfo: EditableEntry): boolean {
  if (entryInfo.name == null) return false;

  return Object.entries(entryInfo?.attrs ?? {})
    .filter(([{}, attrValue]) => attrValue.isMandatory)
    .map((attr) =>
      [
        // TODO support role-like types
        attr[1].type === djangoContext?.attrTypeValue.boolean,
        attr[1].value.asString?.length,
        attr[1].value.asObject,
        attr[1].value.asGroup,
        Object.keys(attr[1].value.asNamedObject ?? {})[0] &&
          Object.values(attr[1].value.asNamedObject ?? {})[0],
        attr[1].value.asArrayString?.filter((v) => v).length,
        attr[1].value.asArrayObject?.filter((v) => v).length,
        attr[1].value.asArrayGroup?.filter((v) => v).length,
        attr[1].value.asArrayNamedObject?.filter(
          (v) => Object.keys(v)[0] && Object.values(v)[0]
        ).length,
      ].some((value) => value)
    )
    .every((value) => value);
}

export function convertAttrsFormatCtoS(
  attrs: Record<string, EditableEntryAttrs>
): Attribute[] {
  return Object.entries(attrs ?? {}).map(([{}, attrValue]) => {
    switch (attrValue.type) {
      case djangoContext?.attrTypeValue.string:
      case djangoContext?.attrTypeValue.text:
      case djangoContext?.attrTypeValue.date:
        return {
          id: attrValue.schema.id,
          value: attrValue.value.asString,
        };

      case djangoContext?.attrTypeValue.boolean:
        return {
          id: attrValue.schema.id,
          value: attrValue.value.asBoolean,
        };

      case djangoContext?.attrTypeValue.object:
        return {
          id: attrValue.schema.id,
          value: attrValue.value.asObject?.id ?? "",
        };

      case djangoContext?.attrTypeValue.group:
        return {
          id: attrValue.schema.id,
          value: attrValue.value.asGroup?.id ?? "",
        };

      case djangoContext?.attrTypeValue.role:
        return {
          id: attrValue.schema.id,
          value: attrValue.value.asRole?.id ?? "",
        };

      case djangoContext?.attrTypeValue.named_object:
        return {
          id: attrValue.schema.id,
          value: {
            id: Object.values(attrValue.value.asNamedObject)[0]?.id ?? "",
            name: Object.keys(attrValue.value.asNamedObject)[0],
          },
        };

      case djangoContext?.attrTypeValue.array_string:
        return {
          id: attrValue.schema.id,
          value: attrValue.value.asArrayString,
        };

      case djangoContext?.attrTypeValue.array_object:
        return {
          id: attrValue.schema.id,
          value: attrValue.value.asArrayObject?.map((x) => x.id),
        };

      case djangoContext?.attrTypeValue.array_group:
        return {
          id: attrValue.schema.id,
          value: attrValue.value.asArrayGroup?.map((x) => x.id),
        };

      case djangoContext?.attrTypeValue.array_role:
        return {
          id: attrValue.schema.id,
          value: attrValue.value.asArrayRole?.map((x) => x.id),
        };

      case djangoContext?.attrTypeValue.array_named_object:
        return {
          id: attrValue.schema.id,
          value: attrValue.value.asArrayNamedObject?.map((x) => {
            return {
              id: Object.values(x)[0]?.id ?? "",
              name: Object.keys(x)[0],
            };
          }),
        };

      case djangoContext?.attrTypeValue.array_named_object_boolean:
        return {
          id: attrValue.schema.id,
          value: (
            attrValue.value.asArrayNamedObject as {
              [key: string]: Pick<
                EntryAttributeValueObject,
                "id" | "name" | "schema"
              > & {
                boolean?: boolean;
              };
            }[]
          )?.map((x) => {
            return {
              id: Object.values(x)[0]?.id ?? "",
              name: Object.keys(x)[0],
              boolean: Object.values(x)[0]?.boolean ?? false,
            };
          }),
        };
    }
  });
}
