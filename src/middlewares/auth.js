const ethers = require("ethers");

// verify user signature
const isValidSign = async (req, res, next) => {
  try {
    const { message, address, signature } = req.headers;
    const signerAddress = await ethers.utils.verifyMessage(message, signature);
    if (signerAddress !== address) {
      return res.status(401).json({
        success: false,
        errorType: "Unverified",
        errorMessage: "Unverified Signature! Access Denied",
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      success: false,
      errorType: "Unverified",
      errorMessage: "Unverified Signature! Access Denied",
    });
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    return res.status(401).send({
      success: false,
      errorType: "UnAuthorized",
      errorMessage: "UnAuthorized User! Access Denied",
    });
  }
};

module.exports = { isAuthenticated, isValidSign };
