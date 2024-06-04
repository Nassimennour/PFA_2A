const { InterestRate } = require("../models");

exports.getAllInterestRates = async (req, res) => {
  try {
    const interestRates = await InterestRate.findAll();
    res.json(interestRates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getInterestRateById = async (req, res) => {
  const { id } = req.params;
  try {
    const interestRate = await InterestRate.findByPk(id);
    if (!interestRate) {
      return res.status(404).json({ message: "Interest Rate not found" });
    }
    res.json(interestRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createInterestRate = async (req, res) => {
  const { duree, interestRate, organismePretId } = req.body;
  try {
    const newInterestRate = await InterestRate.create({
      duree,
      interestRate,
      organismePretId,
    });
    res.status(201).json(newInterestRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateInterestRate = async (req, res) => {
  const { id } = req.params;
  const { duree, interestRate, organismePretId } = req.body;
  try {
    let interestRate = await InterestRate.findByPk(id);
    if (!interestRate) {
      return res.status(404).json({ message: "Interest Rate not found" });
    }
    interestRate.duree = duree;
    interestRate.interestRate = interestRate;
    interestRate.organismePretId = organismePretId;
    await interestRate.save();
    res.json(interestRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteInterestRate = async (req, res) => {
  const { id } = req.params;
  try {
    const interestRate = await InterestRate.findByPk(id);
    if (!interestRate) {
      return res.status(404).json({ message: "Interest Rate not found" });
    }
    await interestRate.destroy();
    res.json({ message: "Interest Rate deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getInterestRateByDuree = async (req, res) => {
  const { duree } = req.params;
  try {
    const interestRate = await InterestRate.findOne({ where: { duree } });
    if (!interestRate) {
      return res.status(404).json({ error: "Interest Rate not found." });
    }
    res.status(200).json(interestRate);
  } catch (error) {
    console.error("Error retrieving Interest Rate by duree:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Interest Rate." });
  }
};

exports.getInterestRatesByOrganismePretId = async (req, res) => {
  const { organismePretId } = req.params;
  try {
    const interestRates = await InterestRate.findAll({
      where: { organismePretId },
    });
    if (!interestRates) {
      return res
        .status(404)
        .json({ error: "Interest Rates not found for this organismePretId." });
    }
    res.status(200).json(interestRates);
  } catch (error) {
    console.error("Error retrieving Interest Rates by organismePretId:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Interest Rates." });
  }
};
