import { Box, Typography, Button } from "@mui/material";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "react-use";

import { aironeApiClientV2 } from "../apiclient/AironeApiClientV2";
import { useTypedParams } from "../hooks/useTypedParams";

import { topPath, usersPath } from "Routes";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { Loading } from "components/common/Loading";
import { PageHeader } from "components/common/PageHeader";
import { UserForm } from "components/user/UserForm";

export const EditUserPage: FC = () => {
  const { userId } = useTypedParams<{ userId: number }>();

  const user = useAsync(async () => {
    if (userId) {
      return await aironeApiClientV2.getUser(userId);
    }
  });

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    token: "",
    tokenLifetime: "",
  });

  const handleSubmit = () => {
    console.log("[onix/handleSubmit(00)] userInfo: ", userInfo);
  };

  return (
    <Box>
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography component={Link} to={usersPath()}>
          ユーザ管理
        </Typography>
        <Typography color="textPrimary">ユーザ情報の設定</Typography>
      </AironeBreadcrumbs>
      <PageHeader
        title={"ユーザ情報の設定"}
        subTitle={""}
        componentSubmits={
          <Box display="flex" justifyContent="center">
            <Box mx="4px">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
              >
                保存
              </Button>
            </Box>
            <Box mx="4px">
              <Button variant="outlined" color="primary" onClick={() => {}}>
                キャンセル
              </Button>
            </Box>
          </Box>
        }
      />

      {user.loading ? (
        <Loading />
      ) : (
        <UserForm
          user={user.value}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      )}
    </Box>
  );
};
