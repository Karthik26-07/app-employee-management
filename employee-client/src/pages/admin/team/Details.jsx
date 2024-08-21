import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TeamApi } from "../../../Api/TeamApi";
import { showErrorToast } from "../../../lib/utils/toasts";
import { Card, CardBody, Avatar, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../config/env-helper";
import userAvatar from "@/assets/images/user.png";
const TeamDetails = () => {
  const [data, setData] = useState({
    id: null,
    name: null,
    description: null,
    team_lead: {
      name: null,
      email: null,
      id: null,
      image: null,
      contact: null,
    },
    team_members: [
      {
        name: null,
        email: null,
        id: null,
        image: null,
        contact: null,
      },
    ],
  });

  const { team_id } = useParams();

  const fetchData = async () => {
    try {
      const formData = { team_id };
      const response = await TeamApi.getTeams(formData);
      console.log(response.data[0]);
      setData(response.data[0]);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container justify-center mx-auto">
      <div className="mb-16 text-center lg:mb-10">
        {/* <Typography variant="h6" color="blue-gray" className="text-lg">
          Meet the Team
        </Typography> */}
        <Typography
          variant="h1"
          color="blue-gray"
          className="my-2 !text-2xl lg:!text-4xl"
        >
          {data.name}
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full !text-gray-500 max-w-4xl"
        >
          {data.description}
        </Typography>
      </div>
      <div className="my-4 mx-auto">
        <Typography variant="h5" color="blue-gray">
          Team Lead
        </Typography>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <TeamCard key={data.team_lead.id} {...data.team_lead} />
      </div>
      <div className="my-4">
        <Typography variant="h5" color="blue-gray">
          Team Members
        </Typography>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.team_members.map((member) => (
          <TeamCard key={member.id} {...member} />
        ))}
      </div>
    </div>
  );
};

export default TeamDetails;

const TeamCard = ({ image, name, email, contact }) => {
  return (
    <Card className="rounded-lg bg-[#FAFAFA]" shadow={false}>
      <CardBody className="text-center">
        <Avatar
          src={image ? API_URL + image : userAvatar}
          alt={name}
          variant="rounded"
          size="xxl"
          className="mx-auto mb-6 object-top"
        />
        <Typography
          variant="h5"
          color="blue-gray"
          className="!font-medium text-lg"
        >
          {name}
        </Typography>
        <Typography
          color="blue-gray"
          className="mb-2 !text-base !font-semibold text-gray-600"
        >
          {email}
        </Typography>
        <Typography
          color="blue-gray"
          className="mb-2 !text-base !font-semibold text-gray-600"
        >
          {contact}
        </Typography>
      </CardBody>
    </Card>
  );
};
