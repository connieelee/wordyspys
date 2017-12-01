import React from 'react';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';

const mapState = null;
const mapDispatch = null;

const PastTurns = () => (
  <Card className="panel-card">
    <CardContent>
      <Typography type="headline" component="h2">PAST TURNS</Typography>
      <Typography component="p">info will show up here eventually</Typography>
    </CardContent>
  </Card>
);

export default connect(mapState, mapDispatch)(PastTurns);
