import azure.functions as func
import datetime
import logging
import requests
import os
import pyodbc 
from datetime import datetime, timezone
from dateparser import parse



PORTAL_URL = 'http://dropki-adminportal.azurewebsites.net'


def is_after(target_date_text):
    now = datetime.now(timezone.utc)
    target_date = parse(target_date_text)
    return target_date < now

    
def find_drops(db) -> list:
    cursor = db.cursor()
    cursor.execute("SELECT * FROM drop_item WHERE was_rolled=0 or was_started=0") 
    rows = cursor.fetchall()
    started_drops = [row.id for row in rows if row.was_started==0 and is_after(row.signing_date)]
    roll_drops =  [row.id for row in rows if row.was_rolled==0 and is_after(row.roll_date)]
    return started_drops, roll_drops


def start_drop(drop_id):
    url = f'{PORTAL_URL}/drop/startDrop'
    req = requests.post(url, json={'dropId':drop_id})
    assert req.status_code==200, f"Server returned {req.status_code}"
    logging.info(f'Started drop {drop_id}')


def run_drop(drop_id):
    url = f'{PORTAL_URL}/drop/rollDrop'
    req = requests.post(url, json={'dropId':drop_id})
    assert req.status_code==200, f"Server returned {req.status_code}"
    logging.info(f'Rolled drop {drop_id}')


def main(mytimer: func.TimerRequest) -> None:

    db = pyodbc.connect(os.environ.get('DatabaseConnectionString'))
    started_drops, roll_drops = find_drops(db)

    for drop_id in started_drops:
        start_drop(drop_id)

    for drop_id in roll_drops:
        run_drop(drop_id)
