import { Avatar, Typography } from "@material-tailwind/react";
import userAvatar from "@/assets/images/user.png";
import { API_URL } from "../config/env-helper";

const UserAvatar = ({ image, name, email }) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src={image != null ? API_URL + image : userAvatar}
        alt={name}
        size="md"
      />
      <div className="flex flex-col">
        <Typography color="blue-gray" variant="h6">
          {name}
        </Typography>
        <Typography
          variant="small"
          color="gray"
          className="font-medium line-clamp-1"
        >
          {email}
        </Typography>
      </div>
    </div>
  );
};

export default UserAvatar;
