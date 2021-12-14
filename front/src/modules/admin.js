import { request } from './request.js';

const updateUser = (userId, userEmail) => {
    if (userId == null) {
        return request('PUT', '/api/users', { email: userEmail });
    } else {
        return request('POST', '/api/users' + userId, { email: userEmail });
    }
}

const updateDatabase = (dbId, dbName, dbPath) => {
    if (dbId == null) {
        return request('PUT', '/api/database', { name: dbName, path: dbPath });
    } else {
        return request('POST', '/api/database' + dbId, { name: dbName, path: dbPath });
    }
}

const get_all_db = () => {
    return request('GET', '/api/db', {})
}


const get_all_users = () => {
    return request('GET', '/api/users', {})
}

const get_all_roles = () => {
    return request('GET', '/api/roles', {})
}


const get_all_db_users = () => {
    return request('GET', '/api/dbusers/', {})
}

const update_db_user = (id, name, db, role, password) => {
    if (id == null) {
        return request('PUT', '/api/dbusers/', { name: name, db: db, role: role, password: password });
    } else {
        return request('POST', '/api/dbusers/' + id, { name: name, db: db, role: role, password: password });
    }
}


const get_all_rights = () => {
    return request('GET', '/api/admin/rights', {})
}


const update_right = (id, db_id, user_id, expiration, role) => {
    if (id == null) {
        return request('PUT', '/api/rights/', { db_id: db_id, user_id: user_id, role: role, expiration: expiration });
    } else {
        return request('POST', '/api/rights/' + id, { db_id: db_id, user_id: user_id, role: role, expiration: expiration });
    }
}

const delete_right = (id) => {
    return request('DELETE', '/api/rights/' + id, {});
}

const delete_db_user = (id) => {
    return request('DELETE', '/api/dbusers/' + id, {});
}

const delete_db = (id) => {
    return request('DELETE', '/api/db/' + id, {});
}

const delete_user = (id) => {
    return request('DELETE', '/api/users/' + id, {});
}

const get_all_active_rights = async () => {
    return request('GET', '/api/active', {});

}

const delete_active_connections = async (id) => {
    return request('DELETE', '/api/active/' + id, {});
}

export { get_all_roles, delete_active_connections, get_all_active_rights, delete_right, delete_db_user, delete_db, delete_user, update_right, get_all_rights, update_db_user, get_all_db_users, get_all_db, get_all_users, updateUser, updateDatabase };