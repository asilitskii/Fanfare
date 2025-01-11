from pages.login_page import *
from utils.locators import *
from utils.users_lists import *
from seleniumbase import BaseCase
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv('BASE_URL')

BaseCase.main(__name__, __file__)

class LoginPageSignUpButton(BaseCase):
    def test_sign_up_button(self):
        self.open(f'{BASE_URL}login')

        page = LoginPage()

        print(self.get_current_url())

        page.click_sign_up_button(self)

        self.find_element(*RegisterPageLocators.REGISTER_PAGE)
