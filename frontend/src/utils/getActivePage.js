const getActivePage = () => {
  const url = window.location.pathname;
  const activeTab = url.split("/")[1];
  return activeTab;
};

export default getActivePage;
