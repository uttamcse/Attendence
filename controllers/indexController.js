const getHomeInfo = (req, res) => {
  const name = process.env.NAME || "FairMinds!";
  res.json({ info: `Hello ${name}` });
};

module.exports = { getHomeInfo };