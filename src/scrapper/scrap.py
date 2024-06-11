# pip install webdriver-manager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import datetime
import re
import json
import time
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import DuplicateKeyError



#################################### VARIABLES ####################################
pageLimit = 1
totalResults = 0
prices = []
list_url = []
size = []
articleList = []
colorArray = []
currentDate = datetime.datetime.now()
color = {
    'NOIR' : '#000000',
    'GRIS' : '#919191',
    'BLANC': '#FFFFFF',
    'CRÈME': '#F8F8E1',
    'BEIGE': '#F4E0C8',
    'ABRICOT': '#FFCC98',
    'ORANGE': '#FFA500',
    'CORAIL': '#FF8F2F',
    'ROUGE': '#CC3300',
    'BORDEAUX': '#AE2E3D',
    'ROSE': '#FF0080',
    'VIOLET': '#800080',
    'LILA': '#D297D2',
    'BLEU CLAIR': '#89CFF0',
    'BLEU': '#007BC4',
    'MARINE': '#35358D',
    'TURQUOISE': '#B7DEE8',
    'MENTHE': '#AEFFBC',
    'VERT': '#369A3D',
    'VERT FONCÉ': '#356639',
    'KAKI': '#86814A',
    'MARRON': '#663300',
    'MOUTARDE': '#E5B539',
    'JAUNE': '#FFF200',
    'ARGENTÉ': '#919191',
    'DORÉ': '#FFF200',
    'MULTICOLORE': '#000000'
}
wait_time = 10
url = "https://www.vinted.fr/catalog?catalog[]=79&brand_ids[]=2319&brand_ids[]=53&brand_ids[]=304&brand_ids[]=362&order=newest_first"
mongodb_password = os.environ.get("MONGODB_PASSWORD")
mongoURI = f"mongodb+srv://florianpescot4:{mongodb_password}@clusterbotvinted.f4tqrc2.mongodb.net/?retryWrites=true&w=majority&appName=ClusterBotVinted"

client = MongoClient(mongoURI, server_api=ServerApi('1'))
db = client.Articles
articles_collection = db.Articles
#################################### FUNCTIONS ####################################

def convert_upload_date(upload_date):
    match = re.search(r'(\d+)\s+(SECONDE|MINUTE|HEURE|JOUR|MOIS|AN)', upload_date)

    if match:
        quantity = int(match.group(1))
        unit = match.group(2)

        if unit == 'SECONDE':
            delta = datetime.timedelta(seconds=quantity)
        elif unit == 'MINUTE':
            delta = datetime.timedelta(minutes=quantity)
        elif unit == 'HEURE':
            delta = datetime.timedelta(hours=quantity)
        elif unit == 'JOUR':
            delta = datetime.timedelta(days=quantity)
        elif unit == 'MOIS':
            delta = datetime.timedelta(days=quantity * 30)
        elif unit == 'AN':
            delta = datetime.timedelta(days=quantity * 365)  

        return datetime.datetime.now() - delta

    else:
        return None
    
def verification_last_article(article_data):

    existing_article = articles_collection.find_one({"url": article_data["url"]})
    return existing_article is not None


################################### SCRAPPER ######################################
    
while True:
    s = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=s)
    driver.get(url)

    urlElement = WebDriverWait(driver, wait_time).until(
        EC.presence_of_element_located((By.XPATH, '//a[@class="new-item-box__overlay new-item-box__overlay--clickable"]')))
    url_text = urlElement.get_attribute("href")

    driver.get(url_text)
    imgResult = WebDriverWait(driver, wait_time).until(
        EC.presence_of_element_located((By.XPATH, "//img[@data-testid='item-photo-1--img']")))
    priceResult = WebDriverWait(driver, wait_time).until(
        EC.presence_of_element_located((By.XPATH, '//h3[@class="web_ui__Text__text web_ui__Text__subtitle web_ui__Text__left"]')))
    stateResult = WebDriverWait(driver, wait_time).until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(@itemprop,'condition')]")))
    colorResult = WebDriverWait(driver, wait_time).until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(@itemprop,'color')]")))
    sizeResult = WebDriverWait(driver, wait_time).until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(@itemprop,'size')]")))
    UploadDate = WebDriverWait(driver, wait_time).until(
        EC.presence_of_element_located((By.XPATH, "//div[@data-testid='item-details-uploaded_date']")))
    TitleResult = WebDriverWait(driver, wait_time).until(
        EC.presence_of_element_located((By.XPATH, "//div[contains(@itemprop,'name')]")))
    UploadDate_Converted = convert_upload_date(UploadDate.text)
    print("-----------------------------------")
    print("Titre : ", TitleResult.text)
    print("Date : ", UploadDate_Converted)
    print("Prix :", priceResult.text)
    print("Etat : ", stateResult.text)
    print("Couleur : ", colorResult.text)
    print("Taille : ", sizeResult.text)
    print("Url de l'article : ", url_text)
    print("Image de l'article : ", imgResult.get_attribute("src"))
    print("-----------------------------------")
    colors = colorResult.text.split(', ')
    colorArray = [color[colorT] for colorT in colors]

    article_data = {
        "titre": TitleResult.text,
        "url": url_text,
        "date": UploadDate_Converted,
        "prix": priceResult.text,
        "etat": stateResult.text,
        "couleur": colorResult.text,
        "taille": sizeResult.text,
        "image_url": imgResult.get_attribute("src")
    }
    if not verification_last_article(article_data):
        try:
            articles_collection.insert_one(article_data)
            print("Article ajouté à la base de données avec succès!")
        except DuplicateKeyError:
            print("L'article a été ajouté par une autre instance.")
        else:
            print("L'article existe déjà dans la base de données.")

    time.sleep(20)

