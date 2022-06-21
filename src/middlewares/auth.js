const ethers = require("ethers");

// verify user signature
const requireSign = async (req, res, next) => {
  try {
    const { message, accountAddress, signature } = req.body;
    const signerAddress = await ethers.utils.verifyMessage(message, signature);
    if (signerAddress !== accountAddress) {
      return res.status(401).json({
        success: false,
        errorType: "Unverified",
        errorMessage: "Unverified Signature! Access Denied",
      });
    }

    // console.log(req);

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

const requireLogin = (req, res, next) => {
  // console.log(req);
  if (req.session.isAuthenticated) {
    req.user = {
      id: req.session.userId,
    };
    next();
  } else {
    return res.status(401).send({
      success: false,
      errorType: "UnAuthorized",
      errorMessage: "UnAuthorized User! Access Denied",
    });
  }
};

module.exports = { requireLogin, requireSign };
