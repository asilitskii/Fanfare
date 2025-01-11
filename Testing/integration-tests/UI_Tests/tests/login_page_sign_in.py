from pages.login_page import *
from utils.locators import *
from utils.users_lists import *
from seleniumbase import BaseCase
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv('BASE_URL')

BaseCase.main(__name__, __file__)

class LoginPageSignIn(BaseCase):
    def test_sign_in_with_valid_user(self):
        self.open(f'{BASE_URL}login')
        
        page = LoginPage()

        page.login_with_valid_user(self, "valid_user", base_users)

        self.find_element(*HomePageLocators.USER_ACCOUNT)
