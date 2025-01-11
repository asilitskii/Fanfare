from pages.register_page import *
from utils.locators import *
from utils.users_lists import *
from seleniumbase import BaseCase
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv('BASE_URL')

BaseCase.main(__name__, __file__)

class RegisterPageDataValidation(BaseCase):
    def test_sign_up_with_invalid_user(self):
        self.open(f'{BASE_URL}register')
        
        page = RegisterPage()
        page.register(self, "invalid_user_correct_email_password", base_users)

        self.find_element(*RegisterPageLocators.REGISTER_PAGE)
