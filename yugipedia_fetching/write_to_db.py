import json
import sqlite3


def insert_monster(card, connection:sqlite3.Connection):
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO card (name, card_type, description, image)
        VALUES (?, ?, ?, ?)
    """, (
        card['name'],
        card['humanReadableCardType'],
        card['desc'],
        card['card_images'][0]['image_url']
    ))

    card_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO monster (card_id, attack, defense, level, monster_type, attribute)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        card_id,
        card['atk'],
        card['def'],
        card['level'],
        card['race'],
        card['attribute']
    ))

    for type in card['typeline']:
        cursor.execute("""
            INSERT INTO monster_class (monster_id, class)
            VALUES (?, ?)
        """, (
            card_id,
            type
        ))
    
    connection.commit()

def insert_spell_trap(card, connection):
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO card (name, card_type, description, image)
        VALUES (?, ?, ?, ?)
    """, (
        card['name'],
        card['humanReadableCardType'],
        card['desc'],
        card['card_images'][0]['image_url']
    ))

def main():
    with open('cards.json') as f:
        cards = json.load(f)['data']

    connection = sqlite3.connect('../database.db')

    for card in cards:
        if 'monster' in card['type'].lower():
            insert_monster(card, connection)
        else:
            insert_spell_trap(card, connection)

    connection.close()

if __name__=="__main__":
    main()

    