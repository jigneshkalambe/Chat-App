const express = require("express");
const { AccountController } = require("../../controllers");
const enforceSubscriptionLimits = require("../../middlewares/enforceSubscriptionLimits ");
const router = express.Router();

router.get("/accountList", AccountController.AccountList);
router.post("/createAccount", AccountController.CreateAccount);
router.post("/loginAccount", AccountController.LoginAccount);
router.post("/updateAccount", AccountController.UpdateAccount);
router.post("/findAccount", AccountController.FindAccount);
router.post("/newUserList", AccountController.removeNewUserList);
router.post("/msg", enforceSubscriptionLimits, AccountController.userAccountMsg);
router.post("/verifyOtp", AccountController.verifyOTP);
router.post("/newFriendRequest", AccountController.friendRequestList);
router.post("/isAcceptRequest", AccountController.AddorRemoveFriendRequest);
router.post("/pendingMsg", AccountController.emptyPendingMsgCount);
router.post("/receiverMsg", AccountController.receiverUserMsg);
router.post("/receiverUserPendingReset", AccountController.resetReceiverUserPendingMsg);

module.exports = router;
