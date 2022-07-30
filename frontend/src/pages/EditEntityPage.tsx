import { Box, Typography, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState } from "react";
import { Link, Prompt } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useAsync } from "react-use";

import { entitiesPath, entityEntriesPath, topPath } from "Routes";
import { aironeApiClientV2 } from "apiclient/AironeApiClientV2";
import { EntityUpdate, Webhook } from "apiclient/autogenerated";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { Loading } from "components/common/Loading";
import { PageHeader } from "components/common/PageHeader";
import { EntityForm } from "components/entity/EntityForm";
import { useTypedParams } from "hooks/useTypedParams";
import { FailedToGetEntity } from "utils/Exceptions";

export const EditEntityPage: FC = () => {
  const { entityId } = useTypedParams<{ entityId: number }>();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [entityInfo, setEntityInfo] = useState<EntityUpdate>({
    id: 0,
    name: "",
    note: "",
    isToplevel: false,
    webhooks: [],
    attrs: [],
  });
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const entity = useAsync(async () => {
    if (entityId !== undefined) {
      return await aironeApiClientV2.getEntity(entityId);
    } else {
      return undefined;
    }
  });
  if (entity !== undefined && !entity.loading && entity.error) {
    throw new FailedToGetEntity(
      "Failed to get Entity from AirOne APIv2 endpoint"
    );
  }

  const referralEntities = useAsync(async () => {
    const entities = await aironeApiClientV2.getEntities();
    return entities.results;
  });

  const handleCancel = () => {
    history.replace(entitiesPath());
  };

  const handleSubmit = async () => {
    const createMode = entityId === undefined;
    // Adjusted attributes for the API
    const attrs = entityInfo.attrs
      .filter((attr) => !(attr.id == null && attr.isDeleted))
      .map((attr, index) => {
        return {
          id: attr.id,
          name: attr.name,
          type: attr.type,
          index: index,
          isMandatory: attr.isMandatory,
          isDeleteInChain: attr.isDeleteInChain,
          isSummarized: attr.isSummarized,
          referral: attr.referral,
          isDeleted: attr.isDeleted,
        };
      });
    const webhooks = entityInfo.webhooks.map((webhook): Webhook => {
      return {
        id: webhook.id,
        url: webhook.url,
        label: webhook.label,
        isEnabled: webhook.isEnabled,
        isVerified: undefined,
        headers: webhook.headers,
        isDeleted: webhook.isDeleted,
      };
    });

    try {
      if (createMode) {
        await aironeApiClientV2.createEntity(
          entityInfo.name,
          entityInfo.note,
          entityInfo.isToplevel,
          attrs,
          webhooks
        );
        setSubmitted(true);
        history.replace(entitiesPath());
      } else {
        await aironeApiClientV2.updateEntity(
          entityId,
          entityInfo.name,
          entityInfo.note,
          entityInfo.isToplevel,
          attrs,
          webhooks
        );
        setSubmitted(true);
        history.replace(entityEntriesPath(entityId));
      }
    } catch (e) {
      if (e instanceof Response) {
        if (!e.ok) {
          const text = await e.text();
          enqueueSnackbar(text, { variant: "error" });
        }
      } else {
        throw e;
      }
    }
  };

  useEffect(() => {
    if (!entity.loading && entity.value !== undefined) {
      setEntityInfo({
        ...entity.value,
        attrs:
          entity.value.attrs.map((attr) => {
            return { ...attr, referral: attr.referral.map((r) => r.id) };
          }) ?? [],
      });
    }
  }, [entity]);

  if (entity.loading || referralEntities.loading) {
    return <Loading />;
  }

  return (
    <Box>
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography component={Link} to={entitiesPath()}>
          エンティティ一覧
        </Typography>
        {entityId && (
          <Typography component={Link} to={entityEntriesPath(entityId)}>
            {entity?.value?.name ?? ""}
          </Typography>
        )}
        <Typography color="textPrimary">
          {entityId ? "エンティティ編集" : "新規エンティティの作成"}
        </Typography>
      </AironeBreadcrumbs>

      <PageHeader
        title={
          entity?.value != null ? entity.value.name : "新規エンティティの作成"
        }
        subTitle={entity?.value && "エンティテイティ詳細 / 編集"}
        componentSubmits={
          <Box display="flex" justifyContent="center">
            <Box mx="4px">
              <Button
                variant="contained"
                color="secondary"
                disabled={!submittable}
                onClick={handleSubmit}
              >
                保存
              </Button>
            </Box>
            <Box mx="4px">
              <Button variant="outlined" color="primary" onClick={handleCancel}>
                キャンセル
              </Button>
            </Box>
          </Box>
        }
      />

      <Box sx={{ marginTop: "111px", paddingLeft: "10%", paddingRight: "10%" }}>
        <EntityForm
          entity={entity.value}
          entityInfo={entityInfo}
          setEntityInfo={setEntityInfo}
          referralEntities={referralEntities.value}
          setSubmittable={setSubmittable}
        />
      </Box>
      <Prompt
        when={!submitted}
        message="編集した内容は失われてしまいますが、このページを離れてもよろしいですか？"
      />
    </Box>
  );
};
