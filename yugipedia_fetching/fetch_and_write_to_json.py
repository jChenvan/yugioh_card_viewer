from datetime import date
import json
import os

import requests


class RetrievalDate:
    def __init__(self) -> None:
        if os.path.exists('last_retrieval_date.txt'):
            with open('last_retrieval_date.txt') as f:
                self.last_retrieved = f.read()
        else:
            self.last_retrieved = None

    def get(self):
        return self.last_retrieved
    
    def set(self, new_date):
        try:
            with open('last_retrieval_date.txt', 'w') as f:
                f.write(new_date)
            self.last_retrieved = new_date
            return True, 'success!'
        except Exception as e:
            return False, str(e)
        
    def set_to_today(self):
        today = date.today()
        return self.set(today.isoformat())

def fetch_cards(last_retrieved:str|None=None):
    start_date_component = f'&startdate={last_retrieved}' if last_retrieved else ''
    url_template = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?&format=tcg' + start_date_component
    response = requests.get(url_template)

    return response.json()

def main():
    retrieval_date = RetrievalDate()

    cards = fetch_cards(last_retrieved=retrieval_date.get())

    if 'error' not in cards:
        with open('cards.json', 'w') as f:
            json.dump(cards,f, indent=2)

        retrieval_date.set_to_today()

if __name__ == '__main__':
    main()