import db from "../models"

const getGroups = async () => {
    try {        
        const groups = await db.Group.findAll({
            order: [
                ['name', 'ASC']
            ]
        })
    
        if(groups) {
            return {
                EM: 'get groups succsess',
                EC: 0,
                DT: groups
            }
        } else {
            return {
                EM: 'get groups failed',
                EC: 1
            }
        }
    } catch (error) {
        console.error(error)
        return {
            EM: 'error from service',
            EC: -1,
            DT: []
        }
    }
}

export const groupService = {
    getGroups
} 