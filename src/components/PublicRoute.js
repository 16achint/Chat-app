import { Redirect, Route } from 'react-router';

const PubilcRoute = ({ children, ...routeProps }) => {
  const profile = false;
  if (profile) {
    return <Redirect to="/" />;
  }
  return <Route {...routeProps}>{children}</Route>;
};

export default PubilcRoute;
