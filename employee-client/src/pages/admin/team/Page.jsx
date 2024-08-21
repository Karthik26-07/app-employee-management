import { useEffect, useState } from "react";

// @material-tailwind-react
import {
  Card,
  Button,
  CardBody,
  CardHeader,
  Typography,
  Tooltip,
  IconButton,
  Alert,
} from "@material-tailwind/react";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import AddEditTeam from "./AddEdit";
import { showErrorToast, showSuccessToast } from "../../../lib/utils/toasts";
import { TeamApi } from "../../../Api/TeamApi";
import user from "../../../assets/images/user.png";
import UserAvatar from "../../../components/UserAvatar";
import { API_URL } from "../../../config/env-helper";
import { Link } from "react-router-dom";

const TeamPage = () => {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState([]);

  const handleOpen = () => setOpen((cur) => !cur);

  const fetchData = async () => {
    try {
      const response = await TeamApi.getTeams();
      setTeams(response.data);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="py-5">
      <Card shadow={false} className=" border-gray-300">
        <CardHeader
          shadow={false}
          floated={false}
          className="flex overflow-visible gap-y-4 flex-wrap items-start justify-between rounded-none"
        >
          <div>
            <Typography
              color="blue-gray"
              variant="h1"
              className="!text-2xl mb-1"
            >
              Teams
            </Typography>
            <Typography
              color="blue-gray"
              className="!text-lg font-normal text-gray-600"
            >
              List of available teams
            </Typography>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              className="flex items-center gap-3"
              size="md"
              onClick={handleOpen}
            >
              <UserGroupIcon strokeWidth={2} className="h-4 w-4" />
              Create Team
            </Button>
            <AddEditTeam
              handleOpen={handleOpen}
              open={open}
              fetchTeams={fetchData}
            />
          </div>

          <Alert variant="ghost" color="dark">
            <Typography className="font-semibold" color="black">
              Please be aware that deleting a team will affect any tasks or
              other data related to it.
            </Typography>
          </Alert>
        </CardHeader>
        <CardBody className="grid xl:grid-cols-3 grid-cols-1 gap-4 px-4">
          {teams.map((props, key) => (
            <TeamCard key={key} {...props} fetchData={fetchData} />
          ))}
        </CardBody>
      </Card>
    </section>
  );
};
export default TeamPage;

const TeamCard = ({ id, name, team_lead, team_members, fetchData }) => {
  const deleteTeam = async (data) => {
    try {
      await TeamApi.deleteTeam(data);
      showSuccessToast("Successfully deleted");
      fetchData();
    } catch (error) {
      showErrorToast(error.message);
    }
  };
  return (
    <Card className="border border-gray-300 overflow-hidden shadow-sm" key={id}>
      <CardBody className="p-4">
        <Typography
          color="blue-gray"
          className="!text-base !font-semibold mb-1"
        >
          {name}
        </Typography>
        <div className="my-4 flex items-start justify-between">
          <UserAvatar
            key={id}
            name={team_lead.name}
            email={"Team Lead"}
            image={team_lead.image}
          />
          <div className="flex gap-2">
            <Tooltip content="View All">
              <Link to={`/admin/team_details/${id}`}>
                <IconButton
                  size="sm"
                  variant="outlined"
                  className="border-gray-300"
                  color="gray"
                >
                  <EyeIcon strokeWidth={2} className="h-4 w-4" />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip content="Delete">
              <IconButton
                size="sm"
                variant="outlined"
                className="border-red-300 "
                color="red"
                onClick={() => deleteTeam({ id: id })}
              >
                <TrashIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {team_members.map(({ id, image, name }) => (
            <Tooltip key={id} content={name}>
              <img
                key={id}
                src={image != null ? API_URL + image : user}
                className="h-full w-full object-cover rounded-xl"
                alt={name}
              />
            </Tooltip>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
