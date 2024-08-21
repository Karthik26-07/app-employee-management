import { Typography } from "@material-tailwind/react";

const SimpleTextCell = ({ value }) => {
  return (
    <div className="flex flex-col">
      <Typography variant="small" color="blue-gray" className="font-medium">
        {value}
      </Typography>
    </div>
  );
};

export default SimpleTextCell;
