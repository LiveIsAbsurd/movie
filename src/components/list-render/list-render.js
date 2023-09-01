import React from 'react';
import { Row } from 'antd';

import './list-render.css';

const ListRender = ({ elements }) => {
  return (
    <React.Fragment>
      <Row justify={'space-evenly'} className="row">
        {elements}
      </Row>
    </React.Fragment>
  );
};

export default ListRender;
