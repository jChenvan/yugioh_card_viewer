import Database from 'better-sqlite3'

const db = new Database('../database.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const create_card_table = db.prepare(`
    CREATE TABLE IF NOT EXISTS card (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        card_type TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL
    )
    `);

const create_monster_table = db.prepare(`
    CREATE TABLE IF NOT EXISTS monster (
        card_id INTEGER PRIMARY KEY
            REFERENCES card(id)
            ON DELETE CASCADE,
        attack INTEGER,
        defense INTEGER,
        level INTEGER,
        monster_type TEXT NOT NULL,
        attribute TEXT NOT NULL
    )
    `);

const create_monster_class_table = db.prepare(`
    CREATE TABLE IF NOT EXISTS monster_class (
        monster_id INTEGER
            REFERENCES monster(card_id)
            ON DELETE CASCADE,
        class TEXT NOT NULL,
        PRIMARY KEY (monster_id, class)
    )
    `);

create_card_table.run();
create_monster_table.run();
create_monster_class_table.run();