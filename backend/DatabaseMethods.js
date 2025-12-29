import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'

const db = new Database('../database.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default {
    findUser: (username) => {
        const findUserQuery = db.prepare(`
            SELECT *
            FROM user
            WHERE username = @username
            `);

        const user = findUserQuery.get({username});

        return user || null;
    },
    addUser: (username, password) => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const addUserQuery = db.prepare(`
            INSERT INTO user (username, password)
            VALUES (@username, @password)
            `)

        try {
            addUserQuery.run({username, password:hash});
            return {success: true};
        } catch (e) {
            console.error(e);
            return {success: false, error: e};
        }
    }
}