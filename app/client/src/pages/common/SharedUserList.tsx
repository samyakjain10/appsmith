import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import { UserRoles } from "api/ApplicationApi";
import UserApi from "api/UserApi";
import React from "react";
import { getCurrentUser } from "selectors/usersSelectors";
import { useSelector } from "store";
import styled from "styled-components";
import ProfileImage from "./ProfileImage";
import ScrollIndicator from "components/ads/ScrollIndicator";

const UserImageContainer = styled.div`
  display: flex;
  margin-right: 24px;

  .org-share-user-icons {
    cursor: default;
    margin-right: -6px;
    width: 24px;
    height: 24px;
    border: 1px solid ${(props) => props.theme.colors.homepageBackground};
    display: inline-flex;
  }
  div.bp3-popover-arrow {
    display: inline-block;
    transform: translate(3px, 0px);
  }
`;

const ProfileImagePopover = styled.div`
  padding: 10px;
  font-size: 14px;
`;

const ProfileImageListPopover = styled.ul`
  list-style-type: none;
  font-size: 14px;
  margin: 0;
  padding: 5px;
  max-height: 40vh;
  overflow-y: auto;
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

const ProfileImageListItem = styled.li`
  padding: 3px;
  display: flex;
  align-items: center;
`;

const ProfileImageListName = styled.span`
  margin-left: 12px;
`;

const ProfileImageMore = styled(ProfileImage)`
  &.org-share-user-icons {
    cursor: pointer;
  }
`;

type SharedUserListProps = {
  userRoles: UserRoles[];
};

export default function SharedUserList({ userRoles }: SharedUserListProps) {
  const currentUser = useSelector(getCurrentUser);
  const scrollWrapperRef = React.createRef<HTMLUListElement>();

  return (
    <UserImageContainer>
      {userRoles.slice(0, 5).map((el: UserRoles) => (
        <Popover
          boundary="viewport"
          hoverCloseDelay={100}
          interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
          key={el.username}
          position={Position.BOTTOM}
          usePortal={false}
        >
          <ProfileImage
            className="org-share-user-icons"
            source={`/api/${UserApi.photoURL}/${el.username}`}
            userName={el.name ? el.name : el.username}
          />
          <ProfileImagePopover>
            {el.username}
            {el.username === currentUser?.username ? " (You)" : ""}
          </ProfileImagePopover>
        </Popover>
      ))}
      {userRoles.length > 5 ? (
        <Popover
          hoverCloseDelay={0}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM}
          usePortal={false}
        >
          <ProfileImageMore
            className="org-share-user-icons"
            commonName={`+${userRoles.length - 5}`}
          />
          <ProfileImageListPopover ref={scrollWrapperRef}>
            {userRoles.slice(5).map((el) => (
              <ProfileImageListItem key={el.username}>
                <ProfileImage
                  className="org-share-user-icons"
                  source={`/api/${UserApi.photoURL}/${el.username}`}
                  userName={el.name ? el.name : el.username}
                />
                <ProfileImageListName>{el.username}</ProfileImageListName>
              </ProfileImageListItem>
            ))}
            <ScrollIndicator
              alwaysShowScrollbar
              containerRef={scrollWrapperRef}
              mode="DARK"
            />
          </ProfileImageListPopover>
        </Popover>
      ) : null}
    </UserImageContainer>
  );
}
