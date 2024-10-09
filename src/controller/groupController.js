const { groupService } = require("../service/groupService")

const getGroups = async (req, res) => {
    try {
        const data = await groupService.getGroups()
        return res.status(201).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json(
            {
                EM: 'error from server',
                EC: '-1',
                DT: ''
            }
        )
    }
}

export const groupController = {
    getGroups
}