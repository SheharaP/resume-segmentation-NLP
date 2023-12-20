import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import logo from "../../assets/images/logo.png";
import "./widget.scss";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Widget({ type }) {

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  let data;

  return (
    <div className="container">
      <div className="card">
        <Card sx={{ maxWidth: 350, minWidth: 325, maxHeight: 500 }}>
          <div className="cardHeader">
            <CardHeader title={type} />
          </div>
          <CardMedia
            component="img"
            height="200"
            image={logo}
            alt="Paella dish"
          />
          <CardContent>
            <div className="widget">
              <div className="left">
                <span className="title">Breed</span>
                <div className="text">Shitzu</div>
              </div>
              <div className="right">
                <span className="title">Age</span>
                <div className="text">21</div>
              </div>
              <div className="right">
                <span className="title">Color</span>
                <div className="text">Black</div>
              </div>
            </div>
          </CardContent>
          <CardActions disableSpacing>
          <div className="char">View characteristics</div>
          <AutoAwesomeRoundedIcon/>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} unmountOnExit>
            <CardContent>
              <Typography paragraph>Characteristics :</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </div>
    </div>
  );
}
