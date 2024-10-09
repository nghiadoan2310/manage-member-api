import { userApiService } from "../service/userApiService";

const searchUser = async (req, res) => {
  try {
    const users = await userApiService.getSearchUser(req.query)
    return res.status(201).json({
      EM: users.EM,
      EC: users.EC,
      DT: users.DT,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
}

const getUserList = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      const data = await userApiService.getUserListWithPagination(
        +req.query.page,
        +req.query.limit
      );

      return res.status(201).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      const data = await userApiService.getUserList();

      return res.status(201).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
}

const getUserById = async (req, res) => {
  try {
      const data = await userApiService.getUserById(req.user.id)

      return res.status(201).json({
        EM: data.EM,
        EC: data.EC,
        DT: {
          data: data.DT,
          meta: {
            token: req.token
          }
        },
      })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
}

const createNewUser = async (req, res) => {
  try {
    if (
      !req.body.userData.email ||
      !req.body.userData.phone ||
      !req.body.userData.password ||
      !req.body.userData.username ||
      !req.body.userData.address
    ) {
      return res.status(400).json({
        EM: "Missing required fields",
        EC: "1",
        DT: [],
      });
    }

    const data = await userApiService.createNewUser(req.body.userData);

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

const updateUser = (req, res) => {};

const deleteUser = async (req, res) => {
  try {
    const data = await userApiService.deleteUser(req.params.id);

    return res.status(201).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

export const userApiController = {
  searchUser,
  getUserList,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
};
