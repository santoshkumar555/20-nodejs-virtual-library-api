import express from "express";
const router = express.Router();

import { register }        from "../controllers/userAccess/01-register.js";
import { sendLoginOtp }    from "../controllers/userAccess/02-sendLoginOtp.js";
import { verifyLoginOtp }  from "../controllers/userAccess/03-verifyLoginOtp.js";
import { logout }          from "../controllers/userAccess/04-logout.js";
import { getMe }           from "../controllers/userAccess/05-getMe.js";
import { checkEmail }      from "../controllers/userAccess/06-checkEmail.js";
import { updateProfile }   from "../controllers/userAccess/07-updateProfile.js";
import { forgotPassword }  from "../controllers/userAccess/08-forgotPassword.js";
import { resetPassword }   from "../controllers/userAccess/09-resetPassword.js";
import { deleteMe }        from "../controllers/userAccess/10-deleteMe.js";
import { adminCreateUser } from "../controllers/userAccess/11-adminCreateUser.js";
import { adminDeleteUser } from "../controllers/userAccess/12-adminDeleteUser.js";

import protect from "../middleware/isUserLoggedIn.js";
import { authorize } from "../middleware/checkUserPermissions.js";

router.post("/register", register);
router.get("/check-email/:email", checkEmail);
router.post("/send-otp", sendLoginOtp);
router.post("/verify-otp", verifyLoginOtp);
router.get("/me", protect, getMe);
router.put("/updateprofile", protect, updateProfile);
router.post("/logout", protect, logout);
router.delete("/me", protect, deleteMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.post("/admin/create-user", protect, authorize("admin"), adminCreateUser);
router.delete("/admin/users/:id", protect, authorize("admin"), adminDeleteUser);

export default router;