import { get_users } from '../db/queries.mjs';


const list_user = async () => {
    console.log("list_user")
    const rows = await get_users()
    for (const element of rows) {
        console.log(element.user_id, element.user_email, element.user_google_id)
    }
};

export { list_user }