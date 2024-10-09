import { authService } from "../service/authService";

const handleSignup = async (req, res) => {
  try {
    if (!req.body.email || !req.body.phoneNumber || !req.body.password) {
      return res.status(400).json({
        EM: "Missing required fields",
        EC: "1",
        DT: [],
      });
    }

    const data = await authService.createNewUser(req.body);

    return res.status(201).json({
      EM: data.EM,
      EC: data.EC,
      DT: [],
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: [],
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    if (!req.body.loginValue || !req.body.password) {
      return res.status(400).json({
        EM: "Missing required fields",
        EC: "1",
        DT: [],
      });
    }

    const data = await authService.handleUserLogin(req.body)

    if (+data.EC === 0) {
      // Set cookie for userId
      res.cookie('token', data.DT.meta.token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000// 1 hour
      })
  
      return res.status(201).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      return res.status(401).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }

  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: [],
    });
  }
};

const handleLogout = (req, res) => {
  try {
    res.clearCookie('token')
    return res.status(200).json({
      EM: "Logged out successfully",
      EC: "0",
      DT: [],
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: [],
    });
  }
}

export const authController = {
  handleSignup,
  handleLogin,
  handleLogout
};
